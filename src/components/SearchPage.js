import React, { Component } from 'react';
import Search from './Search';


export default class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",

      nocontent: false
    }
    this.setSearchStatee = this.setSearchState.bind(this);
  }
  componentDidMount(props) {
  }

  setSearchState = (query) => {
    var url = "http://opentable.herokuapp.com/api/restaurants?city=" + query;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        mode: "cors",
      })
        .then((response) => {
          response.json().then((responseJson) => {
            resolve(responseJson)
            this.setState({
              content: responseJson.restaurants,
              nocontent: false
            })
            if (responseJson.total_entries === 0)
              this.setState({
                nocontent: true
              })
          })
        })
        .catch((error) => {
          reject(error);
          this.props.history.push("/error")
        })
    })
  }

  render(props) {

    var restaurantTile = [];

    if (this.state.content) {

    for (var i = 0; i < this.state.content.length; i++) {
      var name = this.state.content[i].name;
      var city = this.state.content[i].city;
      var state = this.state.content[i].state;
      var country = this.state.content[i].country;
      var address = this.state.content[i].address + ', ' + city + ', ' + state + ', ' + country;
      var url = this.state.content[i].reserve_url;
      var price;
      switch (this.state.content[i].price) {
        case 1:
          price = "$"
          break;
        case 2:
          price = "$$"
          break;
        case 3:
          price = "$$"
          break;
        case 4:
          price = "$$"
          break;
        default:
      }
      restaurantTile.push(
        <div className="grid-33" key={i}>
          <div class="innerContent">
            <h4 className="rest--name"><a href={url} target="_blank">{name}</a></h4>
            <h3 className="rest--add">Address: {address}</h3>
            <h3 className="rest--price">Cost: {price}</h3></div>

        </div>
      )
    }
  }
    return (
      <div className="container">
      <h1 class="mainHeader">OpenTable Restaurant Search</h1>
        <Search data={this.setSearchState} />
        <div class="results">

          {
            (this.state.nocontent)
              ? <p className="noresults">No results. Please try another city.</p>
              : ""
          }
          {restaurantTile}
        </div>
      </div>
    );
  }
}
