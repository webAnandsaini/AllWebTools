import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="py-20 sm:py-32 w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-xl mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 flex-col justify-center">
            <h1 className="text-2xl font-bold text-gray-900 text-center">We're working hard to bring you this content. Please check back soon.</h1>
            <Link href="/" className="btn-primary px-8 py-3 text-base rounded-full w-fit mx-auto mt-5">Back to Home</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
