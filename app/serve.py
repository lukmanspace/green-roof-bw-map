from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
import re

class RangeRequestHandler(SimpleHTTPRequestHandler):

    def send_head(self):
        path = self.translate_path(self.path)

        if os.path.isdir(path):
            return super().send_head()

        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        fs = os.fstat(f.fileno())
        file_size = fs.st_size

        range_header = self.headers.get("Range")

        if range_header:
            match = re.match(r"bytes=(\d+)-(\d*)", range_header)

            if match:
                start = int(match.group(1))
                end = (
                    int(match.group(2))
                    if match.group(2)
                    else file_size - 1
                )

                end = min(end, file_size - 1)

                if start > end:
                    self.send_error(
                        416,
                        "Requested Range Not Satisfiable"
                    )
                    f.close()
                    return None

                self.send_response(206)

                self.send_header(
                    "Content-Type",
                    self.guess_type(path)
                )

                self.send_header(
                    "Content-Range",
                    f"bytes {start}-{end}/{file_size}"
                )

                self.send_header(
                    "Content-Length",
                    str(end - start + 1)
                )

                self.send_header(
                    "Accept-Ranges",
                    "bytes"
                )

                self.end_headers()

                f.seek(start)

                self.range = (
                    start,
                    end
                )

                return f

        self.send_response(200)

        self.send_header(
            "Content-Type",
            self.guess_type(path)
        )

        self.send_header(
            "Content-Length",
            str(file_size)
        )

        self.send_header(
            "Accept-Ranges",
            "bytes"
        )

        self.end_headers()

        self.range = None

        return f


    def copyfile(
        self,
        source,
        outputfile
    ):

        if getattr(
            self,
            "range",
            None
        ):

            start, end = self.range

            remaining = (
                end - start + 1
            )

            while remaining > 0:

                chunk = source.read(
                    min(
                        64 * 1024,
                        remaining
                    )
                )

                if not chunk:
                    break

                outputfile.write(
                    chunk
                )

                remaining -= len(
                    chunk
                )

        else:

            super().copyfile(
                source,
                outputfile
            )


if __name__ == "__main__":

    server = ThreadingHTTPServer(
        ("127.0.0.1", 8000),
        RangeRequestHandler
    )

    print(
        "Serving on http://localhost:8000"
    )

    server.serve_forever()