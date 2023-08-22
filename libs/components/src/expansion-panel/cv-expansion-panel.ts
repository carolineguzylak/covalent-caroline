import { LitElement, css, html, unsafeCSS } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  queryAssignedNodes,
} from 'lit/decorators.js';
import styles from './cv-expansion-panel.scss?inline';
import { CovalentExpansionPanelItem } from './cv-expansion-panel-item';

@customElement('cv-expansion-panel')
export class CovalentExpansionPanel extends LitElement {
  static override styles = [
    css`
      ${unsafeCSS(styles)}
    `,
  ];

  connectedCallback(): void {
    window.addEventListener('cv-expansionPanel-togglePanel', (e) =>
      this._handleToggle(e)
    );
    this.firstUpdated();
  }

  @property({ type: Boolean, reflect: true }) noSurface = false;
  @property({ type: String }) titleWidth = '150px';
  @queryAssignedElements() panelItems!: CovalentExpansionPanelItem[];
  @queryAssignedNodes({ slot: 'mainSlot', flatten: true })
  panelItems2!: CovalentExpansionPanelItem[];

  render() {
    return html`
      <div class="container">
        <div class="content">
          <slot id="mainSlot"></slot>
        </div>
      </div>
    `;
  }

  private _handleToggle = (e: Event): void => {
    console.log('items');
    console.log(this.panelItems);

    console.log('items2');
    console.log(this.panelItems2);

    const items: any[] = Array.from(
      document.querySelectorAll('cv-expansion-panel-item')
    );

    let toggledPanelIndex = e.detail.index;
    let panel = items[toggledPanelIndex];

    // close the currently open panel if there is one
    items.forEach((item) => {
      if (item != panel) {
        item.resetPanel();
      }
    });
    console.log(items);
    if (panel.open) {
      items.forEach((item) => {
        // Format the panel above and below the opened panel
        if (item.index == toggledPanelIndex - 1) {
          if (item.index == 0) {
            // if this is the top panel
            item.separateSinglePanel = true;
          } else {
            item.aboveOpenInnerPanel = true;
          }
        } else if (item.index == toggledPanelIndex + 1) {
          if (item.index == items.length - 1) {
            item.separateSinglePanel = true;
          }
          item.belowOpenInnerPanel = true;
        }
      });
    }
  };

  protected override firstUpdated() {
    this.style.setProperty(
      '--cv-expansion-panel-item-title-width',
      this.titleWidth
    );

    if (this.noSurface) {
      this.style.setProperty('--mdc-theme-surface', 'transparent');
    }

    // All expandable-panel components.
    const items: any[] = Array.from(
      document.querySelectorAll('cv-expansion-panel-item')
    );
    if (items.length == 1) {
      items[0].isSinglePanel = true;
    } else {
      // set index and type of each panel
      let i = 0;
      items.forEach((item) => {
        if (i == 0) {
          item.isTopPanel = true;
        } else if (i == items.length - 1) {
          item.isBottomPanel = true;
        } else {
          item.isInnerPanel = true;
        }
        item.index = i;
        i++;
      });
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cv-expansion-panel': CovalentExpansionPanel;
  }
}
