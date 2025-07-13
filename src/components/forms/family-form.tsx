
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const childSchema = z.object({
  name: z.string().min(1, "Child's name is required."),
  dob: z.date({ required_error: "Date of birth is required." }),
  accompanying: z.enum(["yes", "no"], { required_error: "Please select an option." }),
});

const familySchema = z.object({
  parent1Name: z.string().min(1, "Parent's name is required."),
  parent1Dob: z.date({ required_error: "Date of birth is required." }),
  parent2Name: z.string().min(1, "Parent's name is required."),
  parent2Dob: z.date({ required_error: "Date of birth is required." }),
  parentAddresses: z.string().min(1, "Parent addresses are required."),
  maritalStatus: z.string({ required_error: "Marital status is required." }),
  spouseName: z.string().optional(),
  spouseDob: z.date().optional(),
  spouseAccompanying: z.enum(["yes", "no"]).optional(),
  children: z.array(childSchema),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
}).refine(data => {
    if (data.maritalStatus === 'married' || data.maritalStatus === 'common-law') {
        return !!data.spouseName && !!data.spouseDob && !!data.spouseAccompanying;
    }
    return true;
}, {
    message: "Spouse details are required for your selected marital status.",
    path: ["spouseName"],
});

type FamilyFormValues = z.infer<typeof familySchema>;

export function FamilyForm() {
  const form = useForm<FamilyFormValues>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      children: [],
    },
  });

  const { fields: childrenFields, append: appendChild, remove: removeChild } = useFieldArray({
    control: form.control,
    name: "children",
  });
  
  const watchMaritalStatus = form.watch("maritalStatus");
  const isSpouseRequired = watchMaritalStatus === "married" || watchMaritalStatus === "common-law";

  function onSubmit(data: FamilyFormValues) {
    console.log(data);
    toast({
      title: "Family Info Saved!",
      description: "Your family information has been successfully saved.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Family Information</CardTitle>
          <CardDescription>We need your immediate family details for IRCC’s Family Information form.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div>
                <h3 className="text-lg font-medium">Parents</h3>
                <Separator className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="parent1Name" render={({ field }) => (
                        <FormItem><FormLabel>Parent 1 Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="parent1Dob" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Parent 1 Date of Birth</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormField control={form.control} name="parent2Name" render={({ field }) => (
                        <FormItem><FormLabel>Parent 2 Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="parent2Dob" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Parent 2 Date of Birth</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="parentAddresses" render={({ field }) => (
                    <FormItem className="mt-6"><FormLabel>Parents' Address & Country of Residence</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            <div>
                <h3 className="text-lg font-medium">Spouse / Partner</h3>
                <Separator className="my-4" />
                 <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                    <FormItem><FormLabel>Marital Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="single">Single</SelectItem><SelectItem value="married">Married</SelectItem><SelectItem value="common-law">Common-Law</SelectItem><SelectItem value="divorced">Divorced</SelectItem><SelectItem value="widowed">Widowed</SelectItem>
                            </SelectContent>
                        </Select>
                    <FormMessage /></FormItem>
                 )} />
                {isSpouseRequired && (
                    <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <FormField control={form.control} name="spouseName" render={({ field }) => (
                            <FormItem><FormLabel>Spouse's Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="spouseDob" render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>Spouse's Date of Birth</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                        )} />
                    </div>
                     <FormField control={form.control} name="spouseAccompanying" render={({ field }) => (
                        <FormItem className="space-y-3 mt-6"><FormLabel>Will your spouse accompany you to Canada?</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage /></FormItem>
                    )} />
                    </>
                )}
            </div>

            <div>
                <h3 className="text-lg font-medium">Children</h3>
                <Separator className="my-4" />
                {childrenFields.map((field, index) => (
                <div key={field.id} className="space-y-4 rounded-md border p-4 mb-4 relative">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeChild(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name={`children.${index}.name`} render={({ field }) => (
                            <FormItem><FormLabel>Child's Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`children.${index}.dob`} render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>Child's Date of Birth</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("2000-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                        )} />
                    </div>
                    <FormField control={form.control} name={`children.${index}.accompanying`} render={({ field }) => (
                        <FormItem className="space-y-3"><FormLabel>Will this child accompany you to Canada?</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage /></FormItem>
                    )} />
                </div>
                ))}
                 <Button type="button" variant="outline" size="sm" onClick={() => appendChild({ name: '', dob: new Date(), accompanying: 'no' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Child
                </Button>
            </div>
            
            <div>
                <h3 className="text-lg font-medium">Emergency Contact (Optional)</h3>
                <Separator className="my-4" />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="emergencyContactName" render={({ field }) => (
                        <FormItem><FormLabel>Contact Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="emergencyContactPhone" render={({ field }) => (
                        <FormItem><FormLabel>Contact Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </div>

        </CardContent>
      </form>
    </Form>
  );
}
