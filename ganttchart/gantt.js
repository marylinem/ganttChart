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
			chart(shadowRoot);

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


	function chart(shadowRoot){
		console.log("code funktioniert");
		am5.ready(function() {

			// Create root element
		// https://www.amcharts.com/docs/v5/getting-started/#Root_element
		var root = am5.Root.new(shadowRoot.querySelector("#chartdiv"));
		root.dateFormatter.setAll({
		dateFormat: "yyyy-MM-dd",
		dateFields: ["valueX", "openValueX"]
		});


		// Set themes
		// https://www.amcharts.com/docs/v5/concepts/themes/
		root.setThemes([
		am5themes_Animated.new(root)
		]);
		// Create chart
		// https://www.amcharts.com/docs/v5/charts/xy-chart/
		var chart = root.container.children.push(am5xy.XYChart.new(root, {
			panX: false,
			panY: false,
			wheelX: "panX",
			wheelY: "zoomX",
			layout: root.verticalLayout
		}));
		
		
		// Add legend
		// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
		var legend = chart.children.push(am5.Legend.new(root, {
			centerX: am5.p50,
			x: am5.p50
		}))
		
		var colors = chart.get("colors");
		
		// Data
		var data = myDataBinding.data.map((e)=>({
			category:e.dimensions_0.label,
  			start:e.dimensions_1.label,
  			end:e.dimensions_2.label,
			columnSettings: {
				fill: am5.Color.brighten(colors.getIndex(8), 1.2)
			},
			task: e.dimensions_3.label
		}))

	
		// Create axes
		// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
		var yAxis = chart.yAxes.push(
			am5xy.CategoryAxis.new(root, {
			categoryField: "category",
			renderer: am5xy.AxisRendererY.new(root, {}),
			tooltip: am5.Tooltip.new(root, {})
			})
		);
		
		yAxis.data.setAll([
			{ category: "Module #1" },
			{ category: "Module #2" },
			{ category: "Module #3" },
			{ category: "Module #4" },
			{ category: "Module #5" }
		]);
		
		var xAxis = chart.xAxes.push(
			am5xy.DateAxis.new(root, {
			baseInterval: { timeUnit: "minute", count: 1 },
			renderer: am5xy.AxisRendererX.new(root, {})
			})
		);
		
		
		// Add series
		// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
		var series = chart.series.push(am5xy.ColumnSeries.new(root, {
			xAxis: xAxis,
			yAxis: yAxis,
			openValueXField: "start",
			valueXField: "end",
			categoryYField: "category",
			sequencedInterpolation: true
		}));
		
		series.columns.template.setAll({
			templateField: "columnSettings",
			strokeOpacity: 0,
			tooltipText: "{task}:\n[bold]{openValueX}[/] - [bold]{valueX}[/]"
		});
		
		series.data.setAll(data);
		
		// Add scrollbars
		chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));
		
		// Make stuff animate on load
		// https://www.amcharts.com/docs/v5/concepts/animations/
		series.appear();
		chart.appear(1000, 100);
		
  }); // end am5.ready()
}

	customElements.define("com-demo-chart", Chart);

	
})();