import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ToolContentTemplateProps {
  introduction: string;
  description: string;
  howToUse: string[];
  features: string[];
  faqs: Array<{ question: string; answer: string }>;
  toolInterface: React.ReactNode;
}

const ToolContentTemplate = ({
  introduction,
  description,
  howToUse,
  features,
  faqs,
  toolInterface,
}: ToolContentTemplateProps) => {
  return (
    <>
      {/* Introduction */}
      <div className="mb-8">
        <p className="text-lg font-medium text-gray-700 mb-4">{introduction}</p>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Tool Interface */}
      <div className="mb-10">{toolInterface}</div>

      {/* How to Use Section */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">How to Use This Tool</h2>
        <Card>
          <CardContent className="p-6">
            <ol className="space-y-4 list-decimal list-inside">
              {howToUse.map((step, index) => (
                <li key={index} className="text-gray-700">
                  {step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">Tool Features</h2>
        <Card>
          <CardContent className="p-6">
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5">✅</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* FAQs Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
};

export default ToolContentTemplate;