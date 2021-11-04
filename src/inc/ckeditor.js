import React, { Component } from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class ckeditor extends Component {
  render() {
    const { contents, } = this.props;

    return (
      <div id='ckeditor' name='sub_contents' >
        <CKEditor name='sub_contents'
          editor={ClassicEditor}
          data={contents}
        />
      </div>
    );
  }
}

export default ckeditor;