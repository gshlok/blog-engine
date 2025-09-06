import { useState } from 'react';
import {
  Box,
  ButtonGroup,
  IconButton,
  Textarea,
  Tooltip,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiBold,
  FiItalic,
  FiLink,
  FiImage,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
} from 'react-icons/fi';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [selection, setSelection] = useState<{ start: number; end: number }>({ start: 0, end: 0 });
  const bgColor = useColorModeValue('white', 'gray.700');

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setSelection({
      start: target.selectionStart,
      end: target.selectionEnd,
    });
  };

  const insertMarkdown = (prefix: string, suffix: string = prefix) => {
    const newValue =
      value.substring(0, selection.start) +
      prefix +
      value.substring(selection.start, selection.end) +
      suffix +
      value.substring(selection.end);
    onChange(newValue);
  };

  const handleImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      insertMarkdown(`![Image](${url})`);
    }
  };

  const handleLink = () => {
    const url = prompt('Enter link URL:');
    if (url) {
      insertMarkdown('[', `](${url})`);
    }
  };

  return (
    <Box border="1px" borderColor="gray.200" borderRadius="md" bg={bgColor}>
      <HStack p={2} borderBottomWidth={1} spacing={2}>
        <ButtonGroup size="sm" isAttached variant="outline">
          <Tooltip label="Bold">
            <IconButton
              aria-label="Bold"
              icon={<FiBold />}
              onClick={() => insertMarkdown('**')}
            />
          </Tooltip>
          <Tooltip label="Italic">
            <IconButton
              aria-label="Italic"
              icon={<FiItalic />}
              onClick={() => insertMarkdown('_')}
            />
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup size="sm" isAttached variant="outline">
          <Tooltip label="Insert Link">
            <IconButton
              aria-label="Insert Link"
              icon={<FiLink />}
              onClick={handleLink}
            />
          </Tooltip>
          <Tooltip label="Insert Image">
            <IconButton
              aria-label="Insert Image"
              icon={<FiImage />}
              onClick={handleImage}
            />
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup size="sm" isAttached variant="outline">
          <Tooltip label="Bullet List">
            <IconButton
              aria-label="Bullet List"
              icon={<FiList />}
              onClick={() => insertMarkdown('- ')}
            />
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup size="sm" isAttached variant="outline">
          <Tooltip label="Align Left">
            <IconButton
              aria-label="Align Left"
              icon={<FiAlignLeft />}
              onClick={() => insertMarkdown('<div style="text-align: left;">', '</div>')}
            />
          </Tooltip>
          <Tooltip label="Align Center">
            <IconButton
              aria-label="Align Center"
              icon={<FiAlignCenter />}
              onClick={() => insertMarkdown('<div style="text-align: center;">', '</div>')}
            />
          </Tooltip>
          <Tooltip label="Align Right">
            <IconButton
              aria-label="Align Right"
              icon={<FiAlignRight />}
              onClick={() => insertMarkdown('<div style="text-align: right;">', '</div>')}
            />
          </Tooltip>
        </ButtonGroup>
      </HStack>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelect}
        minH="300px"
        p={4}
        border="none"
        _focus={{ border: 'none', boxShadow: 'none' }}
        placeholder="Write your blog post here..."
      />
    </Box>
  );
}
