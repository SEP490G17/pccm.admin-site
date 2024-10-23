import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import "./style.scss";
import React from 'react';
import { InputProps } from '@chakra-ui/react';

interface ContentsProps extends InputProps{
    content? : string;
}

const ReactQuillComponent : React.FC<ContentsProps> = (props?) => {
    const toolbarOptions = [
        [{ 'font': [] }],
        // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
        [{ 'align': [] }],
        ['link', 'image', 'video', 'formula'],
        ['clean']                                         // remove formatting button
      ];
    const modules = {
        toolbar: toolbarOptions
    }

    return (
        <ReactQuill theme="snow" modules={modules} className='quill' value={props?.content}/>
    )
}

export default ReactQuillComponent