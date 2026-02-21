#!/usr/bin/env python3
"""Serve the ChemistryBIG folder locally and open it in the default browser.

Usage:
    python open_game.py [--port PORT]

If PORT is omitted or 0, an available ephemeral port is used.
"""
import http.server
import webbrowser
import argparse
import os
import sys


def run(port: int):
    """Start a simple HTTP server serving this folder and open it in a browser."""
    root_dir = os.path.dirname(__file__)
    if root_dir:
        os.chdir(root_dir)

    handler = http.server.SimpleHTTPRequestHandler

    try:
        server_class = http.server.ThreadingHTTPServer
    except AttributeError:
        import socketserver

        class _Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
            pass

        server_class = _Server

    with server_class(("127.0.0.1", port), handler) as httpd:
        bound_port = httpd.server_address[1]
        url = f"http://127.0.0.1:{bound_port}"
        print(f"Serving {os.getcwd()} at {url}")
        try:
            webbrowser.open(url)
        except Exception:
            print("Could not open browser automatically. Visit:", url)

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server")


def main():
    parser = argparse.ArgumentParser(description="Launch ChemistryBIG in a browser by serving this folder locally.")
    parser.add_argument("--port", type=int, default=0, help="Port to bind to (0 = auto)")
    args = parser.parse_args()

    try:
        run(args.port)
    except OSError as e:
        print("Failed to start server:", e)
        sys.exit(1)


if __name__ == "__main__":
    main()
