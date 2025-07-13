
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Basic self-serve platform to get you started on your journey.',
    features: [
      'Eligibility Quiz Access',
      'Basic College Search',
      'Document Checklist',
    ],
    cta: 'Get Started',
    variant: 'outline' as const,
  },
  {
    name: 'Standard',
    price: '$149',
    priceSuffix: 'CAD',
    description: 'DIY application kit with powerful automation tools to guide you.',
    features: [
      'Everything in Free',
      'AI-Powered SOP Generator',
      'Dynamic Document Locker',
      'Full College Match Filtering',
    ],
    cta: 'Choose Standard',
    variant: 'outline' as const,
  },
  {
    name: 'Premium',
    price: '$299',
    priceSuffix: 'CAD',
    description: 'The most popular choice for a confident application.',
    features: [
      'Everything in Standard',
      '1-on-1 RCIC Consultation (30 mins)',
      'Expert SOP Review & Feedback',
      'Final Application Package Review',
    ],
    cta: 'Choose Premium',
    popular: true,
    variant: 'default' as const,
  },
  {
    name: 'Ultimate',
    price: '$999+',
    priceSuffix: 'CAD',
    description: 'A full-service, white-glove experience from start to finish.',
    features: [
      'Everything in Premium',
      'End-to-end School & Visa Service',
      'LOA Sourcing (up to 3 schools)',
      'Full Application Filing by RCIC',
    ],
cta: 'Contact Us',
    variant: 'outline' as const,
  },
];

export default function PricingPage() {
  return (
    <AppLayout>
      <main className="flex-1 space-y-12 p-4 md:p-8">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-black text-foreground">
            Find the Plan That's Right For You
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Whether you're just starting out or need expert guidance, we have a package to help you succeed on your Canadian education journey.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 items-start">
          {tiers.map((tier) => (
            <Card key={tier.name} className={cn(
              `flex flex-col h-full`, 
              tier.popular && 'border-2 border-primary shadow-2xl relative'
            )}>
              {tier.popular && (
                  <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
              )}
              <CardHeader className="pt-8">
                <CardTitle className="font-headline text-2xl font-bold">{tier.name}</CardTitle>
                
                <div className="pt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                    {tier.priceSuffix && <span className="text-sm font-semibold text-muted-foreground ml-1">{tier.priceSuffix}</span>}
                </div>
                <CardDescription className="h-12">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={tier.variant}>
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </AppLayout>
  );
}
