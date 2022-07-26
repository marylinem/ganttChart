(function() { 
	let template = document.createElement("template");
	template.innerHTML = `
		<style>		
		:host #chartdiv {
			width: 100%;
			height: 500px;
			border-color: #92a8d1;
			border-style: solid;

			}
		</style>

		<div id="chartdiv"></div>

	`;

	class Chart extends HTMLElement {
		constructor() {
			super(); 
			let shadowRoot = this.attachShadow({mode: "open"});
			shadowRoot.appendChild(template.content.cloneNode(true));
			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});			
			this._props = {};
			this.init(shadowRoot)
		}

		onCustomWidgetBeforeUpdate(changedProperties) {
			this._props = { ...this._props, ...changedProperties };
		}

		onCustomWidgetAfterUpdate(changedProperties) {
			if ("color" in changedProperties) {
				this.style["background-color"] = changedProperties["color"];
			}			
		}


		async init(shadowRoot){
			for(let fileName of ["index.js","xy.js","themes/Animated.js"]){
				await load(fileName)
				//script.onload = function(){ customElements.define("com-demo-chart", Chart);}; 
		
			}
			console.log(document,shadowRoot.querySelector("#chartdiv"))
			console.log(this.myDataBinding)
			console.log("Data Binding funktioniert")
			chart(shadowRoot,this.myDataBinding);

		}
	}	


	function load(fileName){
	return new Promise(
		function(resolve,reject){
			var script = document.createElement("script"); 
			script.type = "text/javascript"; 
			script.src = "https://cdn.amcharts.com/lib/5/"+fileName; 
			script.onload =  resolve; 
			script.onerror = reject
			document.head.appendChild(script);	
			console.log(script);
		}
	)
	
	}


	function chart(shadowRoot,myDataBinding){
		console.log("code funktioniert");
		am5.ready(function() {

		// Create root element
		var root = am5.Root.new(shadowRoot.querySelector("#chartdiv"));

		// Set themes
		root.setThemes([
		am5themes_Animated.new(root)
		]);

		// Create chart
		var chart = root.container.children.push(am5xy.XYChart.new(root, {
		panX: true,
		panY: true,
		wheelX: "panX",
		wheelY: "zoomX",
		pinchZoomX:true
		}));

		// Add cursor
		var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
		cursor.lineY.set("visible", false);


		// Create axes
		var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
		xRenderer.labels.template.setAll({
		rotation: -90,
		centerY: am5.p50,
		centerX: am5.p100,
		paddingRight: 15
		});

		var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
		maxDeviation: 0.3,
		categoryField: "country",
		renderer: xRenderer,
		tooltip: am5.Tooltip.new(root, {})
		}));

		var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
		maxDeviation: 0.3,
		renderer: am5xy.AxisRendererY.new(root, {})
		}));


		// Create series
		var series = chart.series.push(am5xy.ColumnSeries.new(root, {
		name: "Series 1",
		xAxis: xAxis,
		yAxis: yAxis,
		valueYField: "value",
		sequencedInterpolation: true,
		categoryXField: "country",
		tooltip: am5.Tooltip.new(root, {
			labelText:"{valueY}"
		})
		}));

		series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
		series.columns.template.adapters.add("fill", function(fill, target) {
		return chart.get("colors").getIndex(series.columns.indexOf(target));
		});

		series.columns.template.adapters.add("stroke", function(stroke, target) {
		return chart.get("colors").getIndex(series.columns.indexOf(target));
		});


		// Set data
		var data = myDataBinding.data.map((e)=>({country:e.dimensions_0.label,value:e.measures_0.raw}))

		xAxis.data.setAll(data);
		series.data.setAll(data);


		// Make stuff animate on load
		series.appear(1000);
		chart.appear(1000, 100);

		}); // end am5.ready()
	}

	customElements.define("com-demo-chart", Chart);

	
})();