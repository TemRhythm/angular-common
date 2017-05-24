import { AngularCommonPage } from './app.po';

describe('angular-common App', () => {
  let page: AngularCommonPage;

  beforeEach(() => {
    page = new AngularCommonPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
