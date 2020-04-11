import { Fragment } from 'inferno';
import { useBackend } from '../backend';
import { Box, Button, NoticeBox, Section, Tabs, LabeledList } from '../components';
import { Window } from '../layouts';

export const RoboticsControlConsole = (props, context) => {
  const { act, data } = useBackend(context);
  const {
    can_hack,
    cyborgs = [],
    drones = [],
  } = data;
  return (
    <Window resizable>
      <Window.Content scrollable>
        <Tabs>
          <Tabs.Tab
            key="cyborgs"
            label={`Cyborgs (${cyborgs.length})`}
            icon="list"
            lineHeight="23px">
            {() => (
              <Cyborgs cyborgs={cyborgs} can_hack={can_hack} />
            )}
          </Tabs.Tab>
          <Tabs.Tab
            key="drones"
            label={`Drones (${drones.length})`}
            icon="list"
            lineHeight="23px">
            {() => (
              <Drones drones={drones} />
            )}
          </Tabs.Tab>
        </Tabs>
      </Window.Content>
    </Window>
  );
};

const Cyborgs = (props, context) => {
  const { cyborgs, can_hack } = props;
  const { act, data } = useBackend(context);
  if (!cyborgs.length) {
    return (
      <Section>
        <NoticeBox textAlign="center">
          No cyborg units detected within access parameters
        </NoticeBox>
      </Section>
    );
  }
  return cyborgs.map(cyborg => {
    return (
      <Section
        key={cyborg.ref}
        title={cyborg.name}
        buttons={(
          <Fragment>
            {!!can_hack && !cyborg.emagged && (
              <Button
                icon="terminal"
                content="Hack"
                color="bad"
                onClick={() => act('magbot', {
                  ref: cyborg.ref,
                })} />
            )}
            <Button.Confirm
              icon={cyborg.locked_down ? 'unlock' : 'lock'}
              color={cyborg.locked_down ? 'good' : 'default'}
              content={cyborg.locked_down ? "Release" : "Lockdown"}
              onClick={() => act('stopbot', {
                ref: cyborg.ref,
              })} />
            <Button.Confirm
              icon="bomb"
              content="Detonate"
              color="bad"
              onClick={() => act('killbot', {
                ref: cyborg.ref,
              })} />
          </Fragment>
        )}>
        <LabeledList>
          <LabeledList.Item label="Status">
            <Box color={cyborg.status
              ? 'bad'
              : cyborg.locked_down
                ? 'average'
                : 'good'}>
              {cyborg.status
                ? "Not Responding"
                : cyborg.locked_down
                  ? "Locked Down"
                  : "Nominal"}
            </Box>
          </LabeledList.Item>
          <LabeledList.Item label="Charge">
            <Box color={cyborg.charge <= 30
              ? 'bad'
              : cyborg.charge <= 70
                ? 'average'
                : 'good'}>
              {typeof cyborg.charge === 'number'
                ? cyborg.charge + "%"
                : "Not Found"}
            </Box>
          </LabeledList.Item>
          <LabeledList.Item label="Module">
            {cyborg.module}
          </LabeledList.Item>
          <LabeledList.Item label="Master AI">
            <Box color={cyborg.synchronization ? 'default' : 'average'}>
              {cyborg.synchronization || "None"}
            </Box>
          </LabeledList.Item>
        </LabeledList>
      </Section>
    );
  });
};

const Drones = (props, context) => {
  const { drones } = props;
  const { act } = useBackend(context);

  if (!drones.length) {
    return (
      <Section>
        <NoticeBox textAlign="center">
          No drone units detected within access parameters
        </NoticeBox>
      </Section>
    );
  }

  return drones.map(drone => {
    return (
      <Section
        key={drone.ref}
        title={drone.name}
        buttons={(
          <Button.Confirm
            icon="bomb"
            content="Detonate"
            color="bad"
            onClick={() => act('killdrone', {
              ref: drone.ref,
            })} />
        )}>
        <LabeledList>
          <LabeledList.Item label="Status">
            <Box color={drone.status
              ? 'bad'
              : 'good'}>
              {drone.status
                ? "Not Responding"
                : 'Nominal'}
            </Box>
          </LabeledList.Item>
        </LabeledList>
      </Section>
    );
  });
};
