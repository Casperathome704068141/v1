
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Basic self-serve platform to get you started.',
    features: [
      'Eligibility Quiz',
      'School Search Tool',
      'Consultation Booking',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Standard',
    price: '$149 CAD',
    description: 'DIY application kit with powerful automation tools.',
    features: [
      'Full IRCC Form Autofill (IMM1294)',
      'Guided Document Uploads',
      'Basic SOP Template Generator',
      'AI-Powered Platform Access',
    ],
    cta: 'Choose Standard',
  },
  {
    name: 'Premium',
    price: '$299 CAD',
    description: 'Assisted package with expert review and support.',
    features: [
      'Everything in Standard',
      '1-on-1 RCIC Consultation',
      'SOP Review and Feedback',
      'Polished PDF Application Bundle',
    ],
    cta: 'Choose Premium',
    popular: true,
  },
  {
    name: 'Ultimate',
    price: '$999 - $1,299 CAD',
    description: 'VIP "Done-For-You" concierge service.',
    features: [
      'Everything in Premium',
      'End-to-end School & Visa Service',
      'LOA Sourcing (up to 3 schools)',
      'Full Application Filing by Experts',
    ],
    cta: 'Contact Us',
  },
];

export default function PricingPage() {
  return (
    <AppLayout>
      <main className="flex-1 space-y-8 p-4 md:p-8">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-black text-foreground">
            Our Pricing Plans
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Choose the right package to start your Canadian education journey.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col ${tier.popular ? 'border-primary shadow-lg' : ''}`}>
              <CardHeader>
                <CardTitle className="font-headline text-2xl font-bold">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="pt-4">
                    <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={tier.popular ? 'default' : 'outline'}>
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
