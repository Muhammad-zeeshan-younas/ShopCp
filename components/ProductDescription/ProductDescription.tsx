import { Card, CardContent } from "@/components/ui/card";

interface ProductDescriptionProps {
  description: string;
}

export const ProductDescription = ({ description }: ProductDescriptionProps) => {
  return (
    <Card className="border border-border/50">
      <CardContent className="p-6">
        <p className="text-muted-foreground">{description || "No description available"}</p>
      </CardContent>
    </Card>
  );
};
