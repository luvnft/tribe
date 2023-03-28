import MarkdownIt from 'markdown-it';
import ReactMdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import { Api } from 'service/api';
import { compressImage } from 'service/helper';

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);
const api = new Api();

export function Editor(Props) {

  async function onImageUpload(file) {
    const imageFile = await compressImage(file);
    const formData = new FormData();
    formData.append('fileToUpload', imageFile, imageFile.name);
    formData.append('submit', 'Upload Image');
    const url = await api.uploadImage(formData);
    if (!url.startsWith('http')) {
      return alert(url);
    } else {
      return url;
    }
  }

  return (
    <ReactMdEditor
      style={{ minHeight: '700px', height: '100%' }}
      renderHTML={text => mdParser.render(text)}
      onChange={({ html, text }) => Props.onText(text)}
      onImageUpload={onImageUpload}
      view={{ menu: true, md: true, html: false }}
      {...Props}
    />
  );
}
