
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const tiers = [
  {
    name: 'Explorer',
    price: '$0',
    description: 'Get started with our core tools and see what you can achieve.',
    features: [
      'Eligibility Quiz Access',
      'Basic College Match',
      '15-min Discovery Call Booking',
    ],
    cta: 'Start for Free',
    variant: 'outline' as const,
  },
  {
    name: 'Starter',
    price: '$149',
    priceSuffix: 'CAD',
    description: 'For high-score quiz users (≥75) who just need compliant paperwork.',
    features: [
      'Auto-filled IMM Forms',
      'Dynamic Document Checklist',
      'AI SOP Template Generator',
      'Live Chat Support (24h)',
    ],
    cta: 'Choose Starter',
    variant: 'outline' as const,
  },
  {
    name: 'Advantage',
    price: '$299',
    priceSuffix: 'CAD',
    description: 'For mid-score users (50–74) who want an expert to double-check their work.',
    features: [
      'Everything in Starter, plus:',
      '45-min RCIC Consultation',
      'Expert SOP Review & Edit',
      'Final Application QA Check',
    ],
    cta: 'Choose Advantage',
    popular: true,
    variant: 'default' as const,
  },
  {
    name: 'Elite',
    price: '$1,099+',
    priceSuffix: 'CAD',
    description: 'For low-score users (<50) or busy families wanting full representation.',
    features: [
      'All Advantage features, plus:',
      'Up to 3 College LOA Sourcing',
      'Full IRCC Portal Submission',
      'Priority WhatsApp Support',
    ],
    cta: 'Book Elite Consult',
    variant: 'outline' as const,
  },
];

const addOns = [
    { name: "SOP/LOE Full Ghost-Writing", price: "$50" },
    { name: "Extra College Application", price: "$100 ea." },
    { name: "IRCC Submission (for Starter/Advantage)", price: "$150" },
    { name: "24-Hour Rush Processing", price: "$79" },
    { name: "Hourly Consulting (beyond included)", price: "$100 / hr" },
]

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
                  {tier.features.map((feature, index) => (
                    <li key={feature} className="flex items-start">
                      {index === 0 && tier.features.length > 1 && feature.includes('Everything') ? (
                          <PlusCircle className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                      ) : (
                          <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                      )}
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
        
        <Separator />

        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl">À-la-carte Services</CardTitle>
                    <CardDescription>Add these services to any package as needed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {addOns.map(addon => (
                            <li key={addon.name} className="flex justify-between items-center text-sm">
                                <span className="text-foreground">{addon.name}</span>
                                <span className="font-semibold text-primary">{addon.price}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>

      </main>
    </AppLayout>
  );
}
