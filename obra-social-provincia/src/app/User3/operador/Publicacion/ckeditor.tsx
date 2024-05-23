// import { useRef } from 'react';
// import { Editor } from '@tinymce/tinymce-react';

// interface EditorDefaultProps {
//     value: string;
//     onChange: (content: string) => void;
//     resetContent: boolean; // Nueva prop para controlar el reseteo del contenido
// }

// const EditorDefault: React.FC<EditorDefaultProps> = ({ value, onChange, resetContent }) => {
//   const editorRef = useRef(null);
//   const log = () => {
//     if (editorRef.current) {
//       console.log(editorRef.current.getContent());
//     }
//   };
//   return (
//     <>
//       <Editor
//         apiKey='your-api-key'
//         onInit={(_evt, editor) => editorRef.current = editor}
//         initialValue="<p>This is the initial content of the editor.</p>"
//         init={{
//           height: 500,
//           menubar: false,
//           plugins: [
//             'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
//             'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
//             'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
//           ],
//           toolbar: 'undo redo | blocks | ' +
//             'bold italic forecolor | alignleft aligncenter ' +
//             'alignright alignjustify | bullist numlist outdent indent | ' +
//             'removeformat | help',
//           content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
//         }}
//       />
//       <button onClick={log}>Log editor content</button>
//     </>
//   );
// }


// export default EditorDefault;




















// import React, { useEffect } from 'react';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import Editor from '../../../../../ckeditor5/build/ckeditor';

// interface EditorDefaultProps {
//     value: string;
//     onChange: (content: string) => void;
//     resetContent: boolean; // Nueva prop para controlar el reseteo del contenido
// }

// const EditorDefault: React.FC<EditorDefaultProps> = ({ value, onChange, resetContent }) => {
//     useEffect(() => {
//         if (resetContent) {
//             // Limpiar el contenido cuando resetContent cambia a true
//             onChange('');
//         }
//     }, [resetContent, onChange]);

//     const handleEditorChange = (event: any, editor: { getData: () => any; }) => {
//         const content = editor.getData();
//         onChange(content);
//     };

//     return (
//         <div>
//             <CKEditor
//                 editor={Editor}
//                 data={value}
//                 onChange={handleEditorChange}
//             />
//         </div>
//     );
// }

// export default EditorDefault;




