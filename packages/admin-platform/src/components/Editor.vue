<template>
  <div class="editor">
    <Toolbar class="editor-tool" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor
      class="editor-content"
      v-model="html"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
      @onChange="change"
    />
  </div>
</template>

<script>
import { i18nAddResources, i18nChangeLanguage } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import zhHant from '@/locales/zh-Hant.json';
import en from '@/locales/en.json';

export default {
  components: { Editor, Toolbar },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: String,
  },
  data() {
    return {
      editor: null,
      mode: 'default',
      toolbarConfig: {
        excludeKeys: [
          'emotion',
          'divider',
          'codeBlock',
          'insertTable',
          'insertLink',
          'group-image',
          'group-video',
          'fullScreen',
        ],
      },
      editorConfig: {
        hoverbarKeys: {
          link: { menuKeys: [] },
          image: { menuKeys: [] },
          pre: { menuKeys: [] },
          table: { menuKeys: [] },
          divider: { menuKeys: [] },
          video: { menuKeys: [] },
          text: { menuKeys: [] },
        },
      },
      html: '',
    };
  },
  watch: {
    value(to) {
      if (this.html !== to && this.editor) {
        this.editor.setHtml(to ?? '');
      }
    },
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
  },
  methods: {
    // 初始化
    init() {
      i18nAddResources('zh-Hant', zhHant.Editor);
      i18nAddResources('en', en.Editor);

      if (['pt', 'en'].includes(this.$i18n.locale)) {
        i18nChangeLanguage('en');
      } else {
        i18nChangeLanguage('zh-Hant');
      }
    },
    //
    onCreated(editor) {
      this.editor = Object.seal(editor);
      if (this.value) this.addText(this.value);
    },
    //
    change(event) {
      let html = event.getHtml();
      this.$emit('change', html);
    },
    //
    addText(event) {
      this.editor.focus();
      this.editor.dangerouslyInsertHtml(event);
    },
  },
};
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss">
.editor {
  border-radius: 6px;
  border: 1px solid #ccc;
  ul,
  ol {
    padding-left: 0;
  }
  .editor-tool {
    border-bottom: 1px solid #ccc;
    .w-e-bar {
      background-color: transparent;
    }
  }
  .editor-content {
    .w-e-text-container {
      background-color: transparent;
    }
  }
  .editor-content {
    height: 300px;
    overflow-y: hidden;
  }
}
</style>
