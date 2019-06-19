import React, { Component } from 'react';
import Search from './Search';

var page = "null";

export default class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      query: "",
      nocontent: false,
      endoflist: false,
      page: 1,
      pages: ""
    }
    this.setSearchState = this.setSearchState.bind(this);
    // this.pageChange = this.pageChange.bind(this);


  }
  componentDidMount(props) {
  }


  pageChange = (type) => {
    if (type == 'add' && this.state.page < this.state.pages) {
      this.setState(prevState => {
        return { page: prevState.page + 1 }
      }, function() {
        this.setSearchState(this.state.query);
      });
    }
    if (type == 'sub' && this.state.page > 1) {
      this.setState(prevState => {
        return { page: prevState.page - 1 }
      }, function() {
        console.log(this.state.page)
        this.setSearchState(this.state.query);
      });
    }

  }
  setSearchState = (query) => {

    var page = this.state.page;
    var url = "https://opentable.herokuapp.com/api/restaurants?city=" + query + "&per_page=25&page=" + page;
    console.log(url)
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        mode: "cors",
      })
        .then((response) => {
          response.json().then((responseJson) => {
            console.log(responseJson)
            resolve(responseJson)
    const total_pages = responseJson.total_entries;
    const per_page = responseJson.per_page;
    let pages = total_pages / per_page;
    pages = Math.ceil(pages);
    pages = parseInt(pages, 10) ;
            this.setState({
              content: responseJson,
              nocontent: false,
              query: query,
              pages: pages
            })
            if (responseJson && responseJson.restaurants == 0) {
              this.setState({
                nocontent: true
              })
            }
            if (responseJson && responseJson.restaurants== 0 && this.state.page > 2)
              this.setState({
                endoflist: true
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


    if (this.state.content.restaurants) {

      for (var i = 0; i < this.state.content.restaurants.length; i++) {
        var name = this.state.content.restaurants[i].name;
        var city = this.state.content.restaurants[i].city;
        var state = this.state.content.restaurants[i].state;
        var country = this.state.content.restaurants[i].country;
        var address = this.state.content.restaurants[i].address + ', ' + city + ', ' + state + ', ' + country;
        var url = this.state.content.restaurants[i].reserve_url;
        var price;
        switch (this.state.content.restaurants[i].price) {
          case 1:
            price = "$"
            break;
          case 2:
            price = "$$"
            break;
          case 3:
            price = "$$$"
            break;
          case 4:
            price = "$$$$"
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
            (this.state.nocontent && !this.state.endoflist)
              ? <p className="noresults">No results. Please try another city.</p>
              : ""
          }
          {
            (this.state.endoflist)
              ? <div><p className="noresults">please hit Prev you've gone too far.</p>
                <button onClick={this.pageChange.bind(this, 'clear')} className="bottom">Back to beginning</button></div>
              : ""
          }
          {restaurantTile}

          {
            (this.state.query && !this.state.nocontent || !this.state.nocontent && this.state.endoflist)
              ? <div><button onClick={this.pageChange.bind(this, 'sub')} className="bottom">
                {(this.state.pages <= this.state.page) ? <span>End of List (Prev)</span>: <span>Prev</span> }
                </button>
                <button onClick={this.pageChange.bind(this, 'add')} className="bottom">Next </button>
                </div>
              : ""
          }
        </div>
      </div>
    );
  }
}
