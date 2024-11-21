import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./style.scss";
import React from 'react';

interface ContentsProps{
    content?: string;
    onChange: (value: string) => void;
    className?: string;
}

const ReactQuillComponent: React.FC<ContentsProps> = ({ content, onChange, className='' }) => {
    const toolbarOptions = [
        [{ 'font': [] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'header': 1 }, { 'header': 2 }],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['link', 'image', 'video', 'formula'],
        ['clean']
    ];

    const modules = {
        toolbar: toolbarOptions
    };

    return (
        <ReactQuill
            theme="snow"
            modules={modules}
            className={`quill ${className}`}
            value={content}
            onChange={onChange}
        />
    );
}

export default ReactQuillComponent;
