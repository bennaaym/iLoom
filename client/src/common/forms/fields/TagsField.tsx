import React, { useState } from 'react';
import { TextField, Chip, Box, Typography } from '@mui/material';

interface TagsFieldProps {
  label?: string;
  placeholder?: string;
  initialTags?: string[];
}

const TagsField: React.FC<TagsFieldProps> = ({ label, placeholder = "Add tag", initialTags = [] }) => {
  const [tags, setTags] = useState(initialTags);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      setTags([...tags, e.currentTarget.value]);
      e.currentTarget.value = '';
      e.preventDefault();
    }
  };

  const handleDelete = (tagToDelete: string) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  return (
    <Box mb={2}>
      {label && (
        <Typography variant="subtitle1" gutterBottom>{label}</Typography>
      )}
      <TextField
        fullWidth
        placeholder={placeholder}
        onKeyPress={handleKeyPress}
        variant="outlined"
        sx={{
          mb: 1,
          borderRadius: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
          },
        }}
      />
      <Box display="flex" flexWrap="wrap" gap={1}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={() => handleDelete(tag)}
            sx={{
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TagsField;
