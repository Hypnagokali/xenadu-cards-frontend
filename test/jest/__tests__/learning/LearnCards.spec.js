import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import { useLearnSessionStore } from 'stores/learnSessionStore';
import TestComponent from 'src/pages/learning/TestComponent.vue';
import jestConfig from 'app/jest.config.mjs';
// import { useLearnSessionStore } from 'stores/learnSessionStore';

function factory() {
  return mount(TestComponent);
}

describe('My first test', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('do something', () => {
    // ToDo:
    // const learnSessionStore = useLearnSessionStore();
    // jest;
    // const wrapper = factory();
    // useUserStore();
    // // expect(mockStore.getCardSetId).toHaveBeenCalledWith(1);
    // expect(wrapper.vm.getSomething()).toBe(100);
  });
});
