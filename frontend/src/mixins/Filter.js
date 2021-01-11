var toJson = str => {
		try {
				return JSON.parse(str);
		} catch (e) {
				return false;
		}
}

const Filter = {
		before : ""
		, middle : ""
		, after : ""
		, state : null
		, stateString : null
		, filter : null
		, filterString : null
		, getHashFilter( comp ) {
				let hash = window.location.hash;
				this.parts = hash.match( /^(.*##\$=)(.*)(##.*)$/ );
				let json = null;
				let string =  null;
				this.before = hash + "##$=";
				this.after = "##";
				if( this.parts && this.parts[ 2 ] ) {
						this.before = this.parts[ 1 ];
						this.after = this.parts[ 3 ];
						this.stateString = decodeURI( this.parts[ 2 ] );
						this.state = toJson( this.stateString );
						this.filter = ( this.state ) ? this.state[comp.filterName] : null;
						this.filterString = (this.filter) ? JSON.stringify( this.filter ) : null;
				}
		}
		, analyse( comp ) {
				console.log( "ANALZYE: " + comp.xxx );
				this.getHashFilter( comp );
				console.log( this );
				if( comp.filter ) {
						if( ! this.filterString ) {
								this.update( comp );
						}
				}
				if( this.filter ) {
						if( ! comp.filter || JSON.stringify( comp.filter) != this.filterString ) {
								console.log( "hash changed, update filter and call callback (repl w. watch)" );
								comp.filter = this.filter;
								comp.onFilterChange();
						}
				}
		}
		, update( comp ) {
				let state = this.state || {};
				state[ comp.filterName ] = comp.filter;
				let middle = JSON.stringify( state );
				let hash = `${this.before}${middle}${this.after}`; 
				window.location.hash = hash;
		}
		, request( model, comp ) {
				let query = {};
				for( let field in model ){
						let val = comp.filter.query[field];
						let type = model[ field ].type;
						if( val ){
								switch( type ) { 
										case "String" :
												query[field] = `/${val}/`;
												break;
										default:
												query[field] = val
												break;
								}
						} 
				}
				let sort = comp.filter.sort || {};
				let slice = comp.filter.slice || {};
				let fields = comp.filter.fields || [];
				return [ query, sort, slice, fields ];
		}
		, hashObservers : {}
		, listen( comp ){
				this.hashObservers[ comp._uid ] = () => Filter.analyse( comp );
				Filter.analyse( comp );
		}
		, unlisten( comp ) {
				delete this.hashObservers[ comp._uid ];
		}
};

let hashObservers = {};
window.onhashchange = () => {

		console.warn( "callacks: " + Object.keys( Filter.hashObservers ).length );
		for( const observer in Filter.hashObservers ) {
				console.log( Filter.hashObservers[ observer ] );
				Filter.hashObservers[ observer ]();
		}
}
/* Filter Mixin */
export default { 
		created() {
				Filter.listen( this );
		}
		, destroyed() {
				Filter.unlisten( this );
		}
		, methods: {
				onFilterChange(){
						// empty stub to be overridden
				}
				, updateFilter(){
						Filter.update( this );
				}
				, requestFilter( model ) {
						return Filter.request( model, this );
				}
		}
}

