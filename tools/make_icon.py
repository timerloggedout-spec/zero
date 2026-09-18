"""Draw Zero's mark as a Windows .ico, for the executable's own icon.

The mark is one thick circular arc — a ring with a gap near one o'clock, and the
pale light where its stroke ends — so it is drawn here from that description
rather than traced from a file. `crates/zero-shell/src/app.rs`'s `icon::ring`
draws the same geometry for the window itself; keep the two in step.

The ring is drawn in the logo's blue rather than its ink. A taskbar or a folder
window is the desktop's surface, not ours, and it may be any colour; the ink
version disappears against a dark one.

    python tools/make_icon.py crates/zero-shell/zero.ico
"""

import math
import struct
import sys
import zlib

CENTRE, RADIUS, STROKE = 50.0, 38.0, 17.0
START, SWEEP = -58.0, 324.0  # degrees, clockwise in SVG's y-down frame
TIP = 57.0  # the light spans this much of the sweep, at its end
BASE = (0x55, 0x9F, 0xF3)
PALE = (0xB9, 0xD8, 0xFB)
SAMPLES = 4
SIZES = [256, 128, 64, 48, 32, 24, 16]


def sample(x, y):
    """Colour and coverage at one point, in the mark's own 100-unit frame."""
    dx, dy = x - CENTRE, y - CENTRE
    distance = math.hypot(dx, dy)
    if abs(distance - RADIUS) > STROKE / 2:
        return None
    # How far round the drawn arc this point is, clockwise from the start.
    along = (math.degrees(math.atan2(dy, dx)) - START) % 360
    if along > SWEEP:
        return None  # the gap
    if along < SWEEP - TIP:
        return BASE
    fade = (along - (SWEEP - TIP)) / TIP
    return tuple(round(b + (p - b) * fade) for b, p in zip(BASE, PALE))


def draw(size):
    """One square RGBA image of the mark, supersampled."""
    rows = []
    for py in range(size):
        row = bytearray()
        for px in range(size):
            red = green = blue = hits = 0
            for sy in range(SAMPLES):
                for sx in range(SAMPLES):
                    x = (px + (sx + 0.5) / SAMPLES) / size * 100
                    y = (py + (sy + 0.5) / SAMPLES) / size * 100
                    found = sample(x, y)
                    if found:
                        red, green, blue = red + found[0], green + found[1], blue + found[2]
                        hits += 1
            if hits:
                alpha = round(255 * hits / SAMPLES**2)
                row += bytes((red // hits, green // hits, blue // hits, alpha))
            else:
                row += b"\0\0\0\0"
        rows.append(bytes(row))
    return rows


def png(size, rows):
    def chunk(kind, body):
        return (
            struct.pack(">I", len(body))
            + kind
            + body
            + struct.pack(">I", zlib.crc32(kind + body) & 0xFFFFFFFF)
        )

    body = b"".join(b"\x00" + row for row in rows)
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(body, 9))
        + chunk(b"IEND", b"")
    )


def main():
    images = [(size, png(size, draw(size))) for size in SIZES]
    offset = 6 + 16 * len(images)
    header = struct.pack("<HHH", 0, 1, len(images))
    directory = b""
    for size, data in images:
        # 0 means 256 in an icon directory, which is why it only goes that far.
        directory += struct.pack(
            "<BBBBHHII", size % 256, size % 256, 0, 0, 1, 32, len(data), offset
        )
        offset += len(data)
    out = header + directory + b"".join(data for _, data in images)
    open(sys.argv[1], "wb").write(out)
    print(f"{sys.argv[1]}  {len(out)} bytes, {len(images)} sizes")


main()
