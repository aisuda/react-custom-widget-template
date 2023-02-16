import * as React from 'react';
import { Empty, List } from 'antd';
import { ScopedContext } from 'amis-core';
import axios from 'axios';
import './style.scss'; // 组件内容样式
import myStyle from './cssModule.css';

export default class InfoCard extends React.PureComponent {
  // 指定 contextType 读取当前的 scope context。
  // React 会往上找到最近的 scope Provider，然后使用它的值。
  static contextType = ScopedContext;

  constructor(props, context) {
    super(props);
    this.state = {
      apiData: [],
    };

    const scoped = context;
    scoped.registerComponent(this);

    // 发起一个接口请求，获取动态数据
    axios({
      method: 'get',
      url: 'https://yapi.smart-xwork.cn/mock/170216/list',
      data: {
        firstName: 'Fred',
        lastName: 'Flintstone',
      },
    }).then((response) => {
      if (response && response.status === 200 && response.data) {
        this.setState({
          apiData: response.data.data?.items || [],
        });
      }
    });
  }

  async componentDidMount() {
    // 使用amis事件动作 触发tabs组件切换
    const { dispatchEvent, data, env } = this.props;

    if (dispatchEvent) {
      // 触发一个渲染器事件: custom-widget-DidMount
      dispatchEvent('custom-widget-DidMount', data, this);
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    const scoped = this.context;
    scoped.unRegisterComponent(this);
  }

  agreeDataFormat(agreeData) {
    if (agreeData && agreeData <= 9999) {
      return agreeData;
    }
    if (agreeData && agreeData > 9999) {
      return `${Math.floor(agreeData / 1000) / 10}w`;
    }
  }

  /**
   * 动作处理:
   * 在这里设置自定义组件对外暴露的动作，其他组件可以通过组件动作触发自定义组件的对应动作
   */
  doAction(action, args) {
    const actionType = action ? action.actionType : '';

    if (actionType === 'message') {
      // 接收外部组件的事件动作'message'
      alert('您触发了自定义组件的事件动作[message]');
    } else {
      console.log(
        '自定义组件中监听到的事件动作：',
        action,
        ', 事件参数：',
        args,
      );
    }
  }

  render() {
    const { title, backgroundImage, img_count, comment_count } = this.props;

    // 从本地API接口请求中获取动态数据
    // const apiData = this.state.apiData;

    // 从props中的上下文数据data取动态数据（service组件中的动态数据）
    const apiData = this.props.data?.items || this.state.apiData;

    const curBackgroundImage =
      backgroundImage ||
      'https://search-operate.cdn.bcebos.com/64c279f23794a831f9a8e7a4e0b722dd.jpg';

    return (
      <div className={`news-card ${myStyle.cssTest1}`}>
        <div className="news-title">
          {title ||
            'amis 是一个低代码前端框架，它使用 JSON 配置来生成页面，可以减少页面开发工作量，极大提升效率。'}
        </div>
        <div className="item-imgbox">
          <div
            className="news-img"
            // style={{ backgroundImage: `url(${curBackgroundImage})` }}
          ></div>
          {img_count > 0 && <div className="img-count">{img_count}</div>}
        </div>
        <div className="news-info">
          <div className="left media-mark">爱速搭 · 低代码平台</div>
          {comment_count && comment_count > 0 && (
            <div className="cmt-num right">
              {this.agreeDataFormat(comment_count)}评
            </div>
          )}
        </div>
        <h3>动态数据内容：</h3>
        {apiData && apiData.length > 0 && (
          <List
            itemLayout="horizontal"
            dataSource={apiData}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={<a href="https://ant.design">{item.name}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
              </List.Item>
            )}
          />
        )}
        {(!apiData || apiData.length === 0) && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<>暂无数据</>}
          />
        )}
      </div>
    );
  }
}
