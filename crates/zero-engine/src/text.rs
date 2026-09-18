//! Text shaping: turn a string into positioned glyphs, with font fallback.
//!
//! One glyph per character is wrong for most of the world's scripts. In Devanagari
//! a vowel sign can render *before* the consonant it logically follows, consonants
//! merge into conjuncts, and marks need precise positioning. Shaping (via rustybuzz,
//! a HarfBuzz port) resolves all of that against the font's OpenType tables.
//!
//! No single font covers every script, so the engine holds a prioritized [`FontSet`]
//! and picks, per run, the first font that can draw it.
//!
//! ponytail: fallback is per-word, all-or-nothing — a word mixing scripts no single
//! font covers falls back to font 0 and shows .notdef for the missing part. Per-run
//! splitting by coverage is the upgrade.

/// One font, in both the views the engine needs: shaping and rasterizing.
/// Both come from the same file so glyph ids agree.
pub struct FontEntry<'a> {
    font: &'a crate::LoadedFont,
    pub shaper: &'a rustybuzz::Face<'a>,
}

impl<'a> FontEntry<'a> {
    pub(crate) fn new(font: &'a crate::LoadedFont, shaper: &'a rustybuzz::Face<'a>) -> FontEntry<'a> {
        FontEntry { font, shaper }
    }

    /// The rasterizer, parsed the first time it is asked for. `None` when the
    /// file turned out not to be a font this can draw with.
    pub fn raster(&self) -> Option<&'a fontdue::Font> {
        self.font.raster()
    }
}

/// Fonts in priority order; index 0 is the primary.
pub struct FontSet<'a> {
    pub entries: Vec<FontEntry<'a>>,
}

impl FontSet<'_> {
    /// Index of the first font that can draw every character of `text`,
    /// falling back to the primary font when none covers it fully.
    pub fn pick(&self, text: &str) -> usize {
        // Coverage is asked of the *shaper*, which already has the font's
        // character map open, rather than of the rasterizer, which would have to
        // parse the whole font to answer. That matters because this walks the
        // chain: a Devanagari word passes over the symbol font on its way to the
        // Devanagari one, and parsing every font merely *considered* cost more
        // than drawing the text. Now only a font that actually draws is parsed.
        self.entries
            .iter()
            .position(|e| {
                text.chars()
                    .all(|c| c.is_whitespace() || e.shaper.glyph_index(c).is_some())
            })
            .unwrap_or(0)
    }
}

/// A glyph placed relative to the start of its run (y is up-positive, like the font).
#[derive(Clone)]
pub struct PositionedGlyph {
    pub id: u16,
    pub x: f32,
    pub y: f32,
}

/// Shape `text` at `size` px with one font, returning its glyphs and total advance width.
pub fn shape_run(entry: &FontEntry, text: &str, size: f32) -> (Vec<PositionedGlyph>, f32) {
    let mut buffer = rustybuzz::UnicodeBuffer::new();
    buffer.push_str(text);
    // Infers script, direction, and language from the text itself.
    buffer.guess_segment_properties();

    let output = rustybuzz::shape(entry.shaper, &[], buffer);
    let scale = size / entry.shaper.units_per_em() as f32;

    let mut glyphs = Vec::with_capacity(output.len());
    let mut pen = 0.0;
    for (info, pos) in output.glyph_infos().iter().zip(output.glyph_positions()) {
        glyphs.push(PositionedGlyph {
            id: info.glyph_id as u16,
            x: pen + pos.x_offset as f32 * scale,
            y: pos.y_offset as f32 * scale,
        });
        pen += pos.x_advance as f32 * scale;
    }
    (glyphs, pen)
}
