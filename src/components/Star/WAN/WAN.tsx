import { component$, useContext, useStore, $ } from "@builder.io/qwik";
import { VPNClient } from "./VPNClient/VPNClient";
import { DNSClient } from "../../../trash/DNSClient";
import { VStepper } from "~/components/Core/Stepper/VStepper/VStepper";
import { StarContext } from "../StarContext";
import type { StepItem } from "~/components/Core/Stepper/VStepper/types";
import type { StepProps } from "~/types/step";
import { WANInterface } from "./WANInterface/WANInterface";

export const WAN = component$((props: StepProps) => {
  const starContext = useContext(StarContext);

  const ForeignStep = component$((props: StepProps) => (
    <WANInterface
      mode={"Foreign"}
      isComplete={props.isComplete}
      onComplete$={props.onComplete$}
    />
  ));

  const DomesticStep = component$((props: StepProps) => (
    <WANInterface
      mode={"Domestic"}
      isComplete={props.isComplete}
      onComplete$={props.onComplete$}
    />
  ));

  const VPNClientStep = component$((props: StepProps) => (
    <VPNClient isComplete={props.isComplete} onComplete$={props.onComplete$} />
  ));

  const DNSClientStep = component$((props: StepProps) => (
    <DNSClient isComplete={props.isComplete} onComplete$={props.onComplete$} />
  ));

  const baseSteps: StepItem[] = [
    {
      id: 1,
      title: $localize`Foreign`,
      component: ForeignStep,
      isComplete: false,
    },
    {
      id: 2,
      title: $localize`Domestic`,
      component: DomesticStep,
      isComplete: false,
    },
    {
      id: 3,
      title: $localize`VPN Client`,
      component: VPNClientStep,
      isComplete: false,
    },
  ];

  const steps =
    starContext.state.Mode === "advance"
      ? [
          ...baseSteps,
          {
            id: 4,
            title: $localize`DNS Client`,
            component: DNSClientStep,
            isComplete: false,
          },
        ]
      : baseSteps;

  const stepsStore = useStore({
    activeStep: 0,
    steps,
  });

  const handleStepComplete = $((id: number) => {
    const stepIndex = stepsStore.steps.findIndex((step) => step.id === id);
    if (stepIndex > -1) {
      stepsStore.steps[stepIndex].isComplete = true;
      stepsStore.activeStep = stepIndex + 1;

      if (stepsStore.steps.every((step) => step.isComplete)) {
        props.onComplete$();
      }
    }
  });

  return (
    <div class="container mx-auto w-full px-4">
      <VStepper
        steps={stepsStore.steps}
        activeStep={stepsStore.activeStep}
        onStepComplete$={handleStepComplete}
        onStepChange$={(id: number) => {
          stepsStore.activeStep = id - 1;
        }}
        isComplete={props.isComplete}
      />
    </div>
  );
});
