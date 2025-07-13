
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useApplication } from "@/context/application-context";

const fundingSources = [
  { id: "self", label: "Self" },
  { id: "family", label: "Family" },
  { id: "loan", label: "Loan" },
  { id: "scholarship", label: "Scholarship" },
  { id: "sponsor", label: "Sponsor" },
  { id: "other", label: "Other" },
] as const;

const proofTypes = [
    { id: 'bank_statement', label: 'Bank Statement' },
    { id: 'gic_cert', label: 'GIC Certificate' },
    { id: 'loan_letter', label: 'Loan Letter' },
    { id: 'scholarship_letter', label: 'Scholarship Letter' },
    { id: 'affidavit', label: 'Affidavit of Support' },
] as const;


const financesSchema = z.object({
  totalFunds: z.coerce.number().min(20000, "Minimum funds of CAD $20,000 required.").optional(),
  fundingSources: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one funding source.",
  }),
  primarySponsorName: z.string().optional(),
  sponsorRelationship: z.string().optional(),
  proofType: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one proof type.",
  }),
  tuitionPrepaid: z.enum(["yes", "no"], { required_error: "Please select an option." }).optional(),
  gicPurchased: z.enum(["yes", "no"], { required_error: "Please select an option." }).optional(),
}).refine((data) => {
    if(!data.fundingSources) return true;
    const sponsorSelected = data.fundingSources.includes("family") || data.fundingSources.includes("sponsor");
    if (sponsorSelected && (!data.primarySponsorName || !data.sponsorRelationship)) {
        return false;
    }
    return true;
}, {
    message: "Sponsor name and relationship are required when family or sponsor is selected.",
    path: ["primarySponsorName"],
});

export type FinancesFormValues = z.infer<typeof financesSchema>;

interface FinancesFormProps {
  onSave: () => void;
}

export function FinancesForm({ onSave }: FinancesFormProps) {
  const { applicationData, updateStepData } = useApplication();
  
  const form = useForm<FinancesFormValues>({
    resolver: zodResolver(financesSchema),
    defaultValues: applicationData.finances,
  });
  
  const watchFundingSources = form.watch("fundingSources");
  const isSponsorSelected = watchFundingSources?.includes("family") || watchFundingSources?.includes("sponsor");

  function onSubmit(data: FinancesFormValues) {
    updateStepData('finances', data);
    toast({
      title: "Financial Info Saved!",
      description: "Your financial information has been successfully saved.",
    });
    onSave();
  }

  return (
    <Form {...form}>
      <form id="form-finances" onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Financial Details</CardTitle>
          <CardDescription>Demonstrate you can afford your studies and stay in Canada.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="totalFunds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Funds Available (in CAD)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 35000" {...field} />
                  </FormControl>
                  <FormDescription>Must be at least tuition + $20,000 for living expenses.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fundingSources"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Funding Sources</FormLabel>
                    <FormDescription>Select all that apply.</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {fundingSources.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="fundingSources"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isSponsorSelected && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="primarySponsorName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Primary Sponsor Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="sponsorRelationship"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Sponsor Relationship</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Father, Organization" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            )}

             <FormField
              control={form.control}
              name="proofType"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Proof of Funds Type</FormLabel>
                    <FormDescription>Select all document types you will provide.</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {proofTypes.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="proofType"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
                <FormLabel>Proof Upload</FormLabel>
                <FormDescription>Upload your financial documents (.pdf, .jpg).</FormDescription>
                <Input type="file" multiple className="mt-2" />
                <FormMessage />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="tuitionPrepaid" render={({ field }) => (
                    <FormItem className="space-y-3"><FormLabel>Have you pre-paid your first year's tuition?</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="gicPurchased" render={({ field }) => (
                    <FormItem className="space-y-3"><FormLabel>Have you purchased a GIC of $10,000+?</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormDescription>Required for SDS stream.</FormDescription>
                    <FormMessage /></FormItem>
                )} />
            </div>

        </CardContent>
      </form>
    </Form>
  );
}
