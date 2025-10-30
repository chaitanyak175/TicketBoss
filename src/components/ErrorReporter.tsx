"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, Github, Terminal } from "lucide-react";

type ReporterProps = {
  /*  ⎯⎯ props are only provided on the global-error page ⎯⎯ */
  error?: Error & { digest?: string };
  reset?: () => void;
};

export default function ErrorReporter({ error, reset }: ReporterProps) {
  /* ─ instrumentation shared by every route ─ */
  const lastOverlayMsg = useRef("");
  const pollRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const inIframe = window.parent !== window;
    if (!inIframe) return;

    const send = (payload: unknown) => window.parent.postMessage(payload, "*");

    const onError = (e: ErrorEvent) =>
      send({
        type: "ERROR_CAPTURED",
        error: {
          message: e.message,
          stack: e.error?.stack,
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno,
          source: "window.onerror",
        },
        timestamp: Date.now(),
      });

    const onReject = (e: PromiseRejectionEvent) =>
      send({
        type: "ERROR_CAPTURED",
        error: {
          message: e.reason?.message ?? String(e.reason),
          stack: e.reason?.stack,
          source: "unhandledrejection",
        },
        timestamp: Date.now(),
      });

    const pollOverlay = () => {
      const overlay = document.querySelector("[data-nextjs-dialog-overlay]");
      const node =
        overlay?.querySelector(
          "h1, h2, .error-message, [data-nextjs-dialog-body]"
        ) ?? null;
      const txt = node?.textContent ?? node?.innerHTML ?? "";
      if (txt && txt !== lastOverlayMsg.current) {
        lastOverlayMsg.current = txt;
        send({
          type: "ERROR_CAPTURED",
          error: { message: txt, source: "nextjs-dev-overlay" },
          timestamp: Date.now(),
        });
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onReject);
    pollRef.current = setInterval(pollOverlay, 1000);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onReject);
      pollRef.current && clearInterval(pollRef.current);
    };
  }, []);

  /* ─ extra postMessage when on the global-error route ─ */
  useEffect(() => {
    if (!error) return;
    window.parent.postMessage(
      {
        type: "global-error-reset",
        error: {
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          name: error.name,
        },
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      },
      "*"
    );
  }, [error]);

  /* ─ ordinary pages render nothing ─ */
  if (!error) return null;

  /* ─ global-error UI ─ */
  return (
    <html lang="en">
      <head>
        <title>Error - TicketBoss</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
          <div className="hero-gradient absolute inset-0 pointer-events-none" />
          <div className="relative w-full max-w-2xl">
            <Card className="border-2 card-hover">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <img 
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/ed178baa-610f-4dee-b56e-e01d4ced62e0/generated_images/modern-minimalist-logo-for-ticketboss-ti-878f1112-20251030050533.jpg" 
                    alt="TicketBoss Logo" 
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <span className="text-2xl font-bold gradient-text">TicketBoss</span>
                </div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
                <CardTitle className="text-3xl font-bold mb-2">
                  Oops! Something went wrong
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  We encountered an unexpected error while processing your request. 
                  Don't worry, our team has been notified and we're working on a fix.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {reset && (
                    <Button 
                      onClick={reset}
                      size="lg"
                      className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="gap-2"
                    onClick={() => window.location.href = '/'}
                  >
                    <Home className="w-4 h-4" />
                    Go Home
                  </Button>
                </div>

                {process.env.NODE_ENV === "development" && (
                  <Card className="border-destructive/20 bg-destructive/5">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                        <Terminal className="w-5 h-5" />
                        Development Error Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Error Message:</h4>
                          <p className="text-sm bg-muted p-3 rounded-lg font-mono">
                            {error.message}
                          </p>
                        </div>
                        
                        {error.stack && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Stack Trace:</h4>
                            <pre className="text-xs bg-black dark:bg-gray-950 text-green-400 p-4 rounded-lg overflow-auto max-h-64 font-mono">
                              {error.stack}
                            </pre>
                          </div>
                        )}
                        
                        {error.digest && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Error Digest:</h4>
                            <p className="text-sm bg-muted p-3 rounded-lg font-mono">
                              {error.digest}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="text-center pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    Need help? Contact our support team or check our GitHub repository.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button variant="ghost" size="sm" className="gap-2" asChild>
                      <a href="https://github.com/chaitanyak175/TicketBoss" target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                        GitHub Support
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <style jsx>{`
          .gradient-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .hero-gradient {
            background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(102, 126, 234, 0.3), transparent);
          }
          
          .dark .hero-gradient {
            background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(102, 126, 234, 0.2), transparent);
          }
          
          .card-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          
          .dark .card-hover:hover {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
          }
        `}</style>
      </body>
    </html>
  );
}
