const AppConfig = {
  basePath: '',
  iconsPath: 'icons',
  
  getIconPath: function(iconName) {
    return `${this.basePath}${this.basePath ? '/' : ''}${this.iconsPath}/${iconName}.svg`;
  },
  
  getAssetPath: function(assetPath) {
    return `${this.basePath}${this.basePath ? '/' : ''}${assetPath}`;
  },
  
  icons: {
    'book': 'book',
    'open-book': 'open-book', 
    'plus': 'plus',
    'search': 'search',
    'close': 'close',
    'star': 'star',
    'star_fill': 'star_fill',
    'pen': 'pen',
    'edit': 'edit',
    'trash': 'trash',
    'delete': 'delete',
    'grid': 'grid',
    'list': 'list',
    'chevron-down': 'chevron-down'
  }
};

window.AppConfig = AppConfig;