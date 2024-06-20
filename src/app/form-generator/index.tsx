"use client";
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';

import { generateForm } from '@/actions/generateForm';
import { useFormState, useFormStatus } from 'react-dom';

type Props = {}

const initialState: {
    message: string;
    data?: any;
} = {
    message: ""
}

export function SubmitButton() {
    const { pending } = useFormStatus();
    return (
    <Button type="submit" disabled={pending}>
        {pending ? "Generating..." : "Generate"}
    </Button>
    );
}

const FormGenerator = (props: Props) => {
    const [state, formAction] = useFormState(generateForm, initialState);
    const [open,setOpen] = useState(false);

    useEffect(() => {
        if (state.message === "success") {
        }
        console.log(state.data)
    }, [state.message])
    
    const onFormCreate = () => {
        setOpen(true);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <Button onClick={onFormCreate}>Create Form</Button>
        <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
        </DialogHeader>
        <form action={formAction}>
        <div className='grid gap-4 py-4'>
            <Textarea id="description" name="description" required placeholder='Share what your form is about, who is it for, and what information you would like to collect. And AI will do the magic ✨' />
            </div>
        <DialogFooter>
        <SubmitButton />
            <Button variant="link">Create Manually</Button>
        </DialogFooter>
        </form>
        </DialogContent>
    </Dialog>
    
    )
}

export default FormGenerator