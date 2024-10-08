"use client";

import {
    deleteAgency,
    initUser,
    saveActivityLogsNotification,
    updateAgencyDetails,
} from "@/lib/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Agency } from "@prisma/client";
import { NumberInput } from "@tremor/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FileUpload from "../global/file-upload";
import Loading from "../global/loading";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { useToast } from "../ui/use-toast";

type Props = {
    data?: Partial<Agency>;
};

const FormSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Agency name must be at least 3 characters." }),
    companyEmail: z.string().min(1),
    companyPhone: z.string().min(1),
    whiteLabel: z.boolean(),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
    agencyLogo: z.string().min(1),
});

const AgencyDetails = ({ data }: Props) => {
    const { toast } = useToast();
    const router = useRouter();
    const [deletingAgency, setDeletingAgency] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        mode: "onChange",
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: data?.name,
            companyEmail: data?.companyEmail,
            companyPhone: data?.companyPhone,
            whiteLabel: data?.whiteLabel || false,
            address: data?.address,
            city: data?.city,
            state: data?.state,
            zipCode: data?.zipCode,
            country: data?.country,
            agencyLogo: data?.agencyLogo,
        },
    });

    const isLoading = form.formState.isSubmitting;

    useEffect(() => {
        if (data) {
            form.reset(data);
        }
    }, [form, data]);

    const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            let newUserData;
            let customerId;
            if (!data?.id) {
                const bodyData = {
                    email: values.companyEmail,
                    name: values.name,
                    shipping: {
                        address: {
                            city: values.city,
                            country: values.country,
                            line1: values.address,
                            postal_code: values.zipCode,
                            state: values.state,
                        },
                        name: values.name,
                    },
                    address: {
                        city: values.city,
                        country: values.country,
                        line1: values.address,
                        postal_code: values.zipCode,
                        state: values.state,
                    },
                };
            }

            //WIP: custId
            newUserData = await initUser({ role: "AGENCY_OWNER" });
            if (!data?.customerId) {
                // WIP: CONTINUE FROM HERE
            }
        } catch (error) {}
    };

    const handleDeleteAgency = async () => {
        if (!data?.id) return;
        setDeletingAgency(true);
        // WIP: discontinue the subscription
        try {
            const response = await deleteAgency(data.id);
            toast({
                title: "Agency deleted successfully",
                description: "Deleted your agency and all sub accounts",
            });

            router.refresh();
        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Oops!!",
                description: "Failed to delete your agency",
            });
        }

        setDeletingAgency(false);
    };

    return (
        <AlertDialog>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Agency Information</CardTitle>
                    <CardDescription>
                        Lets create an agency for your business. You can edit
                        agency settings later from the agency settings tab.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="agencyLogo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Agency Logo</FormLabel>
                                        <FormControl>
                                            <FileUpload
                                                apiEndPoint="agencyLogo"
                                                onChange={field.onChange}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            ></FormField>
                            <div className="flex md:flex-row gap-4">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Agency Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Your Agency Name"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="companyEmail"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Agency Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="agency@mail.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex md:flex-row gap-4">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="companyPhone"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>
                                                Agency Phone Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Phone"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex md:flex-row gap-4">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="whiteLabel"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border gap-4 p-4">
                                                <div>
                                                    <FormLabel>
                                                        White Label Agency
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Turning on while label
                                                        mode will show your
                                                        agency logo to all sub
                                                        accounts by default. You
                                                        can overwrite this
                                                        functionality through
                                                        sub account settings.
                                                    </FormDescription>
                                                </div>

                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>
                            <div className="flex md:flex-row gap-4">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel className="">
                                                Address
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="12 street..."
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex md:flex-row gap-4">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel className="">
                                                City
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="City"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel className="">
                                                State
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="State"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="zipCode"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel className="">
                                                ZipCode
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="ZipCode"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex md:flex-row gap-4">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel className="">
                                                Country
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Country"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {data?.id && (
                                <div className="flex flex-col gap-2">
                                    <FormLabel>Create A Goal</FormLabel>
                                    <FormDescription>
                                        ✨ Create a goal for your agency. As
                                        your business grows your goals grow too
                                        so don&apos;t forget to set the bar
                                        higher!
                                    </FormDescription>
                                    <NumberInput
                                        defaultValue={data?.goal}
                                        onValueChange={async (val: number) => {
                                            if (!data?.id) return;
                                            await updateAgencyDetails(data.id, {
                                                goal: val,
                                            });
                                            await saveActivityLogsNotification({
                                                agencyId: data.id,
                                                description: `Updated the agency goal to | ${val} Sub Account`,
                                                subAccountId: undefined,
                                            });
                                            router.refresh();
                                        }}
                                        min={1}
                                        className="bg-background !border !border-input"
                                        placeholder="Sub Account Goal"
                                    />
                                </div>
                            )}

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <Loading />
                                ) : (
                                    "Save Agency Information  "
                                )}
                            </Button>
                        </form>
                    </Form>

                    {data?.id && (
                        <>
                            <div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
                                <div>
                                    <div>Danger Zone</div>
                                </div>
                                <div className="text-muted-foreground">
                                    Deleting your agency cannot be undone. This
                                    will also delete all sub accounts and all
                                    data related to your sub accounts. Sub
                                    accounts will no longer have access to
                                    funnels , contacts etc. Please be careful.
                                </div>
                            </div>
                            <AlertDialogTrigger
                                disabled={isLoading || deletingAgency}
                                className="text-red-600 p-2 px-4 text-center mt-4 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap border border-red-600"
                            >
                                {deletingAgency
                                    ? "Deleting..."
                                    : "Delete Agency"}
                            </AlertDialogTrigger>
                        </>
                    )}
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-left">
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-left">
                                This action cannot be undone. This will
                                permanently delete the Agency account and all
                                related sub accounts.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex items-center">
                            <AlertDialogCancel className="mb-2">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                disabled={deletingAgency}
                                className="bg-destructive hover:bg-destructive"
                                onClick={handleDeleteAgency}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </CardContent>
            </Card>
        </AlertDialog>
    );
};

export default AgencyDetails;
