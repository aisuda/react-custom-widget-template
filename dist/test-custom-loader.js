// 3、测试自定义组件代码中使用 内联loader
// require('!test-custom-loader!./test-import.css');
import 'test-custom-loader?isQuiet=false&cdParentCount=3!./test-import.css';