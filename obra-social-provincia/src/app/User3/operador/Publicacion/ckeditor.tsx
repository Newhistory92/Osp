import React, { useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from '../../../../../ckeditor5/build/ckeditor';

interface EditorDefaultProps {
    value: string;
    onChange: (content: string) => void;
    resetContent: boolean; // Nueva prop para controlar el reseteo del contenido
}

const EditorDefault: React.FC<EditorDefaultProps> = ({ value, onChange, resetContent }) => {
    useEffect(() => {
        if (resetContent) {
            // Limpiar el contenido cuando resetContent cambia a true
            onChange('');
        }
    }, [resetContent, onChange]);

    const handleEditorChange = (event: any, editor: { getData: () => any; }) => {
        const content = editor.getData();
        onChange(content);
    };

    return (
        <div>
            <CKEditor
                editor={Editor}
                data={value}
                onChange={handleEditorChange}
            />
        </div>
    );
}

export default EditorDefault;

