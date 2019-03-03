import React, { Component } from 'react';
import {Row, Col} from 'react-bootstrap';
import Button from 'elements/CustomButton/CustomButton.jsx';


export class CardWithButton extends Component{
    render(){
        return (
            <div className={"card"+(this.props.plain ? " card-plain":"")}>
                <Row className={"header text"}>
                    <Col md={8}>
                    <h4 className="title">{this.props.title}</h4>
                    <p className="category">{this.props.category}</p>

                    </Col>
                    {
                        this.props.showButton ?
                        <Col md={4}>
                            <Button
                                bsStyle="primary"
                                pullRight
                                fill
                                type="submit"
                                onClick={this.props.onButtonClick}
                            >
                                {this.props.buttonName}
                            </Button>
                        </Col>
                        : ''  
                    }
                    
                </Row>
                <div className={"content left-pad" 
                    + (this.props.ctAllIcons ? " all-icons":"")
                    + (this.props.ctTableFullWidth ? " table-full-width":"")
                    + (this.props.ctTableResponsive ? " table-responsive":"")
                    + (this.props.ctTableUpgrade ? " table-upgrade":"")}>

                    {this.props.content}

                    <div className="footer">
                        {this.props.legend}
                        {this.props.stats != null ? <hr />:""}
                        <div className="stats">
                            <i className={this.props.statsIcon}></i> {this.props.stats}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CardWithButton;
