
import { SiteHeader } from '@/components/marketing/site-header';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Check } from 'lucide-react';

const content = [
    { 
        title: "Introduction", 
        text: "This Privacy Policy explains how Maple Leafs Education (“MLE,” “we,” “us”) collects, uses, discloses, and protects the personal information of users (“you”) of our web and mobile applications (the “Platform”). By using the Platform, you consent to the practices described herein."
    },
    {
        title: "What We Collect",
        table: {
            headers: ["Category", "Examples", "Purpose"],
            rows: [
                ["Account Data", "Name, email, password hash, phone, address, country", "Account creation, authentication, communication"],
                ["Immigration Data", "Date of birth, passport details, education/work history, finances, LOA, family info", "Generating IRCC forms, SOP drafts, eligibility scoring"],
                ["Payment Data", "Last four card digits, transaction ID (via Stripe), billing address", "Processing fees, refunds, tax records"],
                ["Usage Data", "IP address, device type, pages visited, quiz scores", "Analytics, fraud prevention, product improvement"],
            ]
        }
    },
    {
        title: "Legal Basis & Use",
        text: "We process data under one or more of the following grounds:",
        list: [
            "Contractual necessity – to deliver purchased services.",
            "Legitimate interest – to improve features and prevent abuse.",
            "Consent – when you voluntarily provide sensitive data.",
            "Legal obligation – for compliance with Canadian tax and law society rules."
        ]
    },
    {
        title: "Sharing & Disclosure",
        list: [
            "With internal staff and RCICs bound by confidentiality.",
            "With service providers (Stripe, AWS, Google Cloud) under strict data protection agreements.",
            "With educational institutions (DLIs) only upon your explicit instruction.",
            "With government agencies if you ask us to submit forms on your behalf or when legally compelled.",
        ]
    },
    {
        title: "Data Security",
        text: "We implement robust security measures to protect your information:",
        list: [
            "Data is encrypted at rest (AES-256) and in transit (TLS 1.3).",
            "Access to sensitive data is restricted to authorized personnel with multi-factor authentication.",
            "We conduct annual penetration tests and security audits.",
        ]
    },
    {
        title: "Your Rights",
        text: "You have the right to:",
        list: [
            "Access and download a copy of your data.",
            "Correct any inaccuracies in your information.",
            "Request deletion of your data, subject to legal retention periods.",
            "Withdraw consent for future data processing."
        ],
        contact: true
    }
];

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <Shield className="mx-auto h-16 w-16 text-primary" />
              <h1 className="text-4xl font-bold font-headline mt-4">Privacy Policy</h1>
              <p className="text-muted-foreground mt-2">Last updated: July 30, 2024</p>
            </header>
            
            <div className="space-y-10">
                {content.map(section => (
                    <section key={section.title}>
                        <h2 className="text-2xl font-semibold font-headline mb-4 border-b pb-2">{section.title}</h2>
                        {section.text && <p className="text-muted-foreground leading-relaxed">{section.text}</p>}
                        {section.list && (
                            <ul className="space-y-3 mt-4">
                                {section.list.map(item => <li key={item} className="flex items-start"><Check className="h-5 w-5 text-success mr-3 mt-1 flex-shrink-0" /><span>{item}</span></li>)}
                            </ul>
                        )}
                        {section.table && (
                            <div className="overflow-x-auto rounded-lg border mt-4">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-card"><tr className="text-left">
                                        {section.table.headers.map(h => <th key={h} className="p-3 font-semibold">{h}</th>)}
                                    </tr></thead>
                                    <tbody>
                                        {section.table.rows.map(row => (
                                            <tr key={row[0]} className="border-t">
                                                {row.map((cell, i) => <td key={i} className={`p-3 align-top ${i === 0 ? 'font-medium' : 'text-muted-foreground'}`}>{cell}</td>)}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {section.contact && (
                             <p className="text-muted-foreground leading-relaxed mt-4">
                                To exercise these rights, please contact our privacy officer at <a href="mailto:privacy@mapleleafs.com" className="text-primary hover:underline">privacy@mapleleafs.com</a>.
                            </p>
                        )}
                    </section>
                ))}
            </div>
          </div>
        </div>
      </main>
       <footer className="bg-card border-t">
          <div className="container mx-auto py-10 px-4">
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-5">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2"><Image src="/logo.svg" alt="Logo" width={24} height={24} /><span className="font-bold text-lg font-headline">Maple Leafs Education</span></div>
                <p className="text-xs text-muted-foreground">&copy; 2024 MLE. A BENO 1017 Product.</p>
              </div>
              {/* Footer links can be mapped here for consistency */}
            </div>
          </div>
        </footer>
    </div>
  );
}
