import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { NeonButton } from "@/components/NeonButton";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold font-display text-destructive">404 ERROR</h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground font-mono mb-6">
            CRITICAL FAILURE: The requested data fragment could not be located in the neural network.
          </p>
          
          <Link href="/">
            <NeonButton variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10 hover:shadow-[0_0_15px_rgba(255,0,0,0.3)]">
              RETURN TO SAFETY
            </NeonButton>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
