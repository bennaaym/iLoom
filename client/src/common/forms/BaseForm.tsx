import React from 'react';
import { Box, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputField from './fields/InputField';
import TagsField from './fields/TagsField';
import SearchableSelect from './SearchableSelect';
import TextAreaField from './fields/TextAreaField';
import BaseSubmitButton from './BaseSubmitButton';

export enum FormFieldType {
    TEXT = 'text',
    SELECT = 'select',
    TAGS = 'tags',
    TEXTAREA = 'textarea',
    FILE = 'file',
}

interface FormField {
    id: string;
    label: string;
    type: FormFieldType;
    options?: { label: string; value: string | number }[];
    placeholder?: string;
}

interface BaseFormProps<T> {
    fields: FormField[];
    initialValues: T;
    validationSchema: Yup.ObjectSchema<any>;
    submitLabel: string;
    isLoading: boolean;
    onSubmit: (values: T) => void;
}

const BaseForm = <T extends Record<string, any>>({
    fields,
    initialValues,
    validationSchema,
    submitLabel,
    isLoading,
    onSubmit
}: BaseFormProps<T>) => {
    const formik = useFormik<T>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
        const file = event.target.files ? event.target.files[0] : null;
        formik.setFieldValue(fieldId, file);
    };

    return (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 3 }}>
            {fields.map((field) => (
                <Box key={field.id} sx={{ mb: 2 }}>
                    {field.type === FormFieldType.TEXT && (
                        <>
                            <InputField
                                id={field.id}
                                label={field.label}
                                onBlur={formik.handleBlur}
                                placeholder={field.placeholder}
                                value={formik.values[field.id]}
                                onChange={formik.handleChange}
                                error={formik.touched[field.id] && Boolean(formik.errors[field.id])}
                            />
                            {formik.touched[field.id] && formik.errors[field.id] && (
                                <Typography color="error.main" fontSize="sm" mt={1}>
                                    {formik.errors[field.id] as string}
                                </Typography >
                            )}
                        </>
                    )}
                    {field.type === FormFieldType.TAGS && (
                        <>
                            <TagsField
                                label={field.label}
                                placeholder={field.placeholder}
                                initialTags={formik.values[field.id]}
                            />
                            {formik.touched[field.id] && formik.errors[field.id] && (
                                <Typography color="error.main" fontSize="sm" mt={1}>
                                    {formik.errors[field.id] as string}
                                </Typography >
                            )}
                        </>
                    )}
                    {field.type === FormFieldType.SELECT && field.options && (
                        <>
                            <SearchableSelect
                                label={field.label}
                                options={field.options}
                                value={formik.values[field.id] || ""}
                                onChange={(event) => formik.setFieldValue(field.id, event.target.value)}
                            />
                            {formik.touched[field.id] && formik.errors[field.id] && (
                                <Typography color="error.main" fontSize="sm" mt={1}>
                                    {formik.errors[field.id] as string}
                                </Typography >
                            )}
                        </>
                    )}
                    {field.type === FormFieldType.TEXTAREA && (
                        <>
                            <TextAreaField
                                label={field.label}
                                value={formik.values[field.id] || ""}
                                onChange={(e) => formik.setFieldValue(field.id, e.target.value)}
                                placeholder={field.placeholder}
                                error={formik.touched[field.id] && Boolean(formik.errors[field.id])}
                            />
                            {formik.touched[field.id] && formik.errors[field.id] && (
                                <Typography color="error.main" fontSize="sm" mt={1}>
                                    {formik.errors[field.id] as string}
                                </Typography >
                            )}
                        </>
                    )}
                    {field.type === FormFieldType.FILE && (
                        <>
                            <Typography variant="subtitle1" gutterBottom>{field.label}</Typography>
                            <input
                                type="file"
                                onChange={(event) => handleFileChange(event, field.id)}
                                accept="image/*"
                                style={{ display: 'block', marginBottom: '8px' }}
                            />
                            {formik.touched[field.id] && formik.errors[field.id] && (
                                <Typography color="error.main" fontSize="sm" mt={1}>
                                    {formik.errors[field.id] as string}
                                </Typography >
                            )}
                        </>
                    )}
                </Box>
            ))}
            <BaseSubmitButton label={submitLabel} isLoading={isLoading} />
        </Box>
    );
};

export default BaseForm;
