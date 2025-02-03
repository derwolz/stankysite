<script>
const currentStep = 1;
const labels = [
	"Writing",
	"Story Editing",
	"Copy Editing",
	"Production",
	"Published"
]
import ProgressBar from "./progress.svelte";

</script>

<ProgressBar labels={labels} currentStep={currentStep} />


