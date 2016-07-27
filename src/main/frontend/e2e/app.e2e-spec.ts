import { IdeahubPage } from './app.po';

describe('ideahub App', function() {
  let page: IdeahubPage;

  beforeEach(() => {
    page = new IdeahubPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('dl works!');
  });
});
