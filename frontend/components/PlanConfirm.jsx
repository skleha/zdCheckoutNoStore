import React from "react";
import classNames from 'classnames'
import * as helperFuncs from "../helpers/helperFuncs";
import * as SubscriptionAPIUtil from "../utils/subscription_api_util";
import { withRouter } from "react-router";


class PlanConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      currentPlan: "",
      previousPlan: "",
      isLoading: true}

    this.handleBackClick = this.handleBackClick.bind(this);
  }

  async componentDidMount() {
    const currentPlan = await SubscriptionAPIUtil.fetchCurrentPlan(this.props.product);
    const previousPlan = await SubscriptionAPIUtil.fetchPreviousPlan(this.props.product);
    this.setState({ 
      currentPlan,
      previousPlan,
      isLoading: false});
  }

  handleBackClick(e) {
    this.props.history.push('/');
  }

  render() {
    const updated = this.state.currentPlan;
    const previous = this.state.previousPlan;
    if (previous === "") return null;
    
    const {
      hasPlanChanged,
      hasSeatsChanged,
      hasCostChanged
    } = helperFuncs.hasSubscriptionChanged(previous, updated);
    
    const planChangeClassName = classNames("confirm-grid-data", {
      changed: hasPlanChanged
    });
    const seatChangeClassName = classNames("confirm-grid-data", {
      changed: hasSeatsChanged
    });
    const costChangeClassName = classNames("confirm-grid-data", {
      changed: hasCostChanged
    });

    return (
      <div className="confirm-component">
        <div className="confirm-title"></div>
        <div className="confirm-grid-container">
          <div className="confirm-grid-title">{`${this.props.product} Plan`}</div>
          <div className="confirm-grid-header">Previous Subscription</div>
          <div className="confirm-grid-header">Updated Subscription</div>
          <div className="confirm-grid-title">Plan Name</div>
          <div className="confirm-grid-data" data-testid="previous-name">{previous.name}</div>
          <div className={planChangeClassName} data-testid="current-name">{updated.name}</div>
          <div className="confirm-grid-title">Seats</div>
          <div className="confirm-grid-data" data-testid="previous-seats">{previous.seats}</div>
          <div className={seatChangeClassName} data-testid="current-seats">{updated.seats}</div>
          <div className="confirm-grid-title">Cost</div>
          <div className="confirm-grid-data" data-testid="previous-cost">{previous.cost}</div>
          <div className={costChangeClassName} data-testid="current-cost">{updated.cost}</div>
        </div>
        <button
          className="confirm-back-button"
          data-testid="back-button"
          onClick={this.handleBackClick}
        >
          Back
        </button>
      </div>
    );
  }
}

export default withRouter(PlanConfirm);
