require('../spec_helper');
import {SimpleAltTabs, SimpleTabs, Tab, BaseTabs, LeftTabs} from '../../../src/pivotal-ui-react/tabs/tabs';
import EventEmitter from 'node-event-emitter';
import {itPropagatesAttributes} from '../support/shared_examples';

describe('Tabs', function() {
  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('BaseTabs', function() {
    // We are using tab-simple here because there are only two options for tabType. However,
    // nothing about SimpleTabs is being used, and any string would work, were it valid.
    const tabType = 'tab-simple';
    let emitter;

    describe('props', function() {
      let onSelectSpy;

      beforeEach(function() {
        onSelectSpy = jasmine.createSpy('onSelectSpy');

        React.render(
          <BaseTabs defaultActiveKey={2} tabType={tabType} className="test-class" id="test-id" style={{opacity: 0.5}}
                    responsiveBreakpoint="md" smallScreenClassName="small-class" largeScreenClassName="large-class"
                    onSelect={onSelectSpy}>
            <Tab eventKey={1} title="Tab1">Content1</Tab>
            <Tab eventKey={2} title="Tab2">Content2</Tab>
          </BaseTabs>,
          root);
      });

      itPropagatesAttributes('#root > div', {className: 'test-class', id: 'test-id', style: {opacity: '0.5'}});

      it('sets the responsive breakpoint', function() {
        expect(`.${tabType}`).toHaveClass('hidden-md');
        expect('.panel-group').toHaveClass('visible-md-block');
      });

      it('passes screen-size specific classes', function() {
        expect(`.${tabType}`).toHaveClass('large-class');
        expect('.panel-group').toHaveClass('small-class');
      });

      it('uses the supplied onSelect method when clicking on large-screen tabs', function() {
        $(`.${tabType} li a:eq(0)`).simulate('click');
        expect(onSelectSpy).toHaveBeenCalled();
      });

      it('uses the supplied onSelect method when clicking on small-screen tabs', function() {
        $(`.panel-group .panel-title a:eq(0)`).simulate('click');
        expect(onSelectSpy).toHaveBeenCalled();
      });

      it('sets up the correct aria-controls relationship', function() {
        let pane1 = $(root).find(`.${tabType} .tab-pane:first`);
        expect(pane1.length).toEqual(1);
        expect(pane1.attr('id')).toBeTruthy();
        expect(`.${tabType} nav ul.nav.nav-tabs li:first a`).toHaveAttr('aria-controls', pane1.attr('id'));
      });
    });

    describe('default behavior', function() {
      beforeEach(function() {
        emitter = new EventEmitter();

        const TestComponent = React.createClass({
          getInitialState() {
            return {defaultActiveKey: 2};
          },

          componentDidMount() {
            emitter.on('changeActiveKey', (key) => this.setState({defaultActiveKey: key}));
          },

          render() {
            return (
              <BaseTabs defaultActiveKey={this.state.defaultActiveKey} tabType={tabType}>
                <Tab eventKey={1} title="Tab1">Content1</Tab>
                <Tab eventKey={2} title="Tab2">Content2</Tab>
              </BaseTabs>
            );
          }
        });

        React.render(<TestComponent />, root);
      });

      it('creates tabs in the correct container', function() {
        expect(`.${tabType} nav ul.nav.nav-tabs li.active`).toContainText('Tab2');
        expect(`.${tabType} .tab-content .tab-pane.fade.active.in`).toContainText('Content2');
      });

      describe('for screens greater than the responsiveBreakpoint', function() {
        it('displays tabs in a simple tab container', function() {
          expect(`.hidden-xs.${tabType} nav li.active`).toContainText('Tab2');
          expect(`.hidden-xs.${tabType} .tab-content`).toContainText('Content2');
        });
      });

      describe('for screens smaller than the responsiveBreakpoint', function() {
        it('renders an accordion', function() {
          expect('.visible-xs-block.panel-group').toExist();
        });

        it('renders headers for each tab', function() {
          expect('.visible-xs-block.panel-group .panel-title:eq(0)').toContainText('Tab1');
          expect('.visible-xs-block.panel-group .panel-title:eq(1)').toContainText('Tab2');
          expect('.visible-xs-block.panel-group .panel-title a:eq(1)').toHaveAttr('aria-expanded', 'true');
        });

        it('renders content for each tab', function() {
          expect('.visible-xs-block.panel-group .panel-collapse:eq(0)').toContainText('Content1');
          expect('.visible-xs-block.panel-group .panel-collapse:eq(1)').toContainText('Content2');
          expect('.visible-xs-block.panel-group .panel-collapse:eq(1)').toHaveClass('in');
        });
      });

      describe('when switching tabs', function() {
        it('switches tabs in both small-screen and large-screen tabs', function() {
          $('.hidden-xs li:eq(0) a').simulate('click');
          expect('.hidden-xs li.active').toContainText('Tab1');
          expect('.visible-xs-block .panel-title a[aria-expanded=true]').toContainText('Tab1');
          $('.visible-xs-block .panel-title:eq(1) a').simulate('click');
          expect('.hidden-xs li.active').toContainText('Tab2');
          expect('.visible-xs-block .panel-title a[aria-expanded=true]').toContainText('Tab2');
        });
      });

      describe('changing the defaultActiveKey props', function() {
        beforeEach(function() {
          emitter.emit('changeActiveKey', 1);
        });

        it('updates the current open tab', function() {
          expect('.hidden-xs li.active').toContainText('Tab1');
          expect('.visible-xs-block .panel-title a[aria-expanded=true]').toContainText('Tab1');
        });
      });

      it('sets up the correct aria-controls relationship', function() {
        let pane1 = $(root).find(`.${tabType} .tab-pane:first`);
        expect(pane1.length).toEqual(1);
        expect(pane1.attr('id')).toBeTruthy();
        expect(`.${tabType} nav ul.nav.nav-tabs li:first a`).toHaveAttr('aria-controls', pane1.attr('id'));
      });
    });

    describe('positioning', function() {
      function renderTabs(props = {}) {
        React.render(
          <LeftTabs defaultActiveKey={1} {...props}>
            <Tab eventKey={1} title="Tab1">Content1</Tab>
            <Tab eventKey={2} title="Tab2">Content2</Tab>
          </LeftTabs>,
          root);
      }

      it('should render tabs stacked on the left', function() {
        renderTabs({position: 'left', tabWidth: 2, paneWidth: 7});
        expect('.hidden-xs nav ul').toHaveClass('nav-stacked');
      });
    });
  });

  describe('SimpleTabs', function() {
    it('should add the class tab-simple to large screen tabs', function() {
      React.render(
        <SimpleTabs defaultActiveKey={1} largeScreenClassName="lgclass">
          <Tab eventKey={1} title="Tab1">Content1</Tab>
          <Tab eventKey={2} title="Tab2">Content2</Tab>
        </SimpleTabs>, root);
      expect('.lgclass').toHaveClass('tab-simple');
    });
  });

  describe('SimpleAltTabs', function() {
    it('should add the class tab-simple to large screen tabs', function() {
      React.render(
        <SimpleAltTabs defaultActiveKey={1} largeScreenClassName="lgclass">
          <Tab eventKey={1} title="Tab1">Content1</Tab>
          <Tab eventKey={2} title="Tab2">Content2</Tab>
        </SimpleAltTabs>, root);
      expect('.lgclass').toHaveClass('tab-simple-alt');
    });
  });

  describe('LeftTabs', function() {
    function renderLeftTabs(props = {}) {
      React.render(
        <LeftTabs defaultActiveKey={1} {...props}>
          <Tab eventKey={1} title="Tab1">Content1</Tab>
          <Tab eventKey={2} title="Tab2">Content2</Tab>
        </LeftTabs>,
        root);
      return BaseTabs.prototype.render.calls.mostRecent().object.props;
    }
    beforeEach(function() {
      spyOn(BaseTabs.prototype, 'render').and.callThrough();
    });

    describe('when props are passed for tabWidth and paneWidth', function() {
      it('passes the provided column sizes tp BaseTabs', function() {
        var baseTabsProps = renderLeftTabs({tabWidth: 4, paneWidth: 6});
        expect(baseTabsProps.tabWidth).toEqual(4);
        expect(baseTabsProps.paneWidth).toEqual(6);
        expect(baseTabsProps.position).toEqual('left');
      });
    });

    describe('when tabWidth is passed and paneWidth is not', function() {
      it('passes the correct column sizes to BaseTabs', function() {
        var baseTabsProps = renderLeftTabs({tabWidth: 4});
        expect(baseTabsProps.tabWidth).toEqual(4);
        expect(baseTabsProps.paneWidth).toEqual(8);
        expect(baseTabsProps.position).toEqual('left');
      });
    });

    describe('when neither tabWidth nor paneWidth are passed', function() {
      it('passes the correct column sizes to BaseTabs', function() {
        var baseTabsProps = renderLeftTabs();
        expect(baseTabsProps.tabWidth).toEqual(3);
        expect(baseTabsProps.paneWidth).toEqual(9);
        expect(baseTabsProps.position).toEqual('left');
      });
    });
  });
});
