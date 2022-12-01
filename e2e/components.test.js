import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

import JSONInline from './components/json-inline.vue'
import JSON5Inline from './components/json5-inline.vue'
import JSONExternal from './components/json-external.vue'
import YamlInline from './components/yaml-inline.vue'
import MultipleBlock from './components/multiple-block.vue'

describe('/components', () => {
  test('processes SFC with i18n JSON inline custom block', () => {
    const i18n = createI18n({ locale: 'en' })
    const wrapper = mount(JSONInline, { global: { plugins: [i18n] }})
    expect(wrapper.text()).toBe('Hello i18n in SFC!')
    expect(wrapper.element).toMatchSnapshot()
  })

  test('processes SFC with i18n JSON5 inline custom block', () => {
    const i18n = createI18n({ locale: 'en' })
    const wrapper = mount(JSON5Inline, { global: { plugins: [i18n] }})
    expect(wrapper.text()).toBe('Hello "i18n" in SFC!')
    expect(wrapper.element).toMatchSnapshot()
  })

  test('processes SFC with i18n JSON in external src attribute', () => {
    const i18n = createI18n({ locale: 'en' })
    const wrapper = mount(JSONExternal, { global: { plugins: [i18n] }})
    expect(wrapper.text()).toBe('Hello i18n in SFC!')
    expect(wrapper.element).toMatchSnapshot()
  })

  test('processes SFC with i18n Yaml Inline', () => {
    const i18n = createI18n({ locale: 'en' })
    const wrapper = mount(YamlInline, { global: { plugins: [i18n] }})
    expect(wrapper.text()).toBe('hello world!')
    expect(wrapper.element).toMatchSnapshot()
  })

  test('merges data blocks', () => {
    const i18n = createI18n({ locale: 'en' })
    const wrapper = mount(MultipleBlock, { global: { plugins: [i18n] }})
    expect(wrapper.text()).toBe('hello world!')
    expect(wrapper.vm.$t('additionalKey')).toEqual('This is an additional key')

    expect(wrapper.element).toMatchSnapshot()
  })
})
