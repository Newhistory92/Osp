import { Editor } from '@tinymce/tinymce-react';

// TinyMCE so the global var exists
import '../../tinymce/tinymce.min.js';
// DOM model
import '../../tinymce/models/dom/model.min.js'
// Theme
import '../../tinymce/themes/silver/theme.min.js';
// Toolbar icons
import '../../tinymce/icons/default/icons.min.js';
// Editor styles
import '../../tinymce/skins/ui/oxide/skin.js';

// importing the plugin index.js file.
// if you use a plugin that is not listed here the editor will fail to load
import '../../tinymce/plugins/advlist/plugin.min.js';
import '../../tinymce/plugins/anchor/plugin.min.js';
import '../../tinymce/plugins/autolink/plugin.min.js';
import '../../tinymce/plugins/autoresize/plugin.min.js';
import '../../tinymce/plugins/autosave/plugin.min.js';
import '../../tinymce/plugins/charmap/plugin.min.js';
import '../../tinymce/plugins/code/plugin.min.js';
import '../../tinymce/plugins/codesample/plugin.min.js';
import '../../tinymce/plugins/directionality/plugin.min.js';
import '../../tinymce/plugins/emoticons/js/emojis.js';
import '../../tinymce/plugins/fullscreen/plugin.min.js';
import '../../tinymce/plugins/help/js/i18n/keynav/ar.js';
import '../../tinymce/plugins/image/plugin.min.js';
import '../../tinymce/plugins/importcss/plugin.min.js';
import '../../tinymce/plugins/insertdatetime/plugin.min.js';
import '../../tinymce/plugins/link/plugin.min.js';
import '../../tinymce/plugins/lists/plugin.min.js';
import '../../tinymce/plugins/media/plugin.min.js';
import '../../tinymce/plugins/nonbreaking/plugin.min.js';
import '../../tinymce/plugins/pagebreak/plugin.min.js';
import '../../tinymce/plugins/preview/plugin.min.js';
import '../../tinymce/plugins/quickbars/plugin.min.js';
import '../../tinymce/plugins/save/plugin.min.js';
import '../../tinymce/plugins/searchreplace/plugin.min.js';
import '../../tinymce/plugins/table/plugin.min.js';
import '../../tinymce/plugins/visualblocks/plugin.min.js';
import '../../tinymce/plugins/visualchars/plugin.min.js';
import '../../tinymce/plugins/wordcount/plugin.min.js';

// importing plugin resources
import '../../tinymce/plugins/emoticons/js/emojis.js';

// Content styles, including inline UI like fake cursors
import '../../tinymce/skins/content/default/content.js';
import '../../tinymce/skins/ui/oxide/content.js';

export default function BundledEditor(props) {
  return (
    <Editor
      licenseKey='gpl'
      {...props}
    />
  );
}