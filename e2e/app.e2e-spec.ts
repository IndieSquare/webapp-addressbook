import { SweeptoPage } from './app.po';

describe('sweepto App', () => {
  let page: SweeptoPage;

  beforeEach(() => {
    page = new SweeptoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
