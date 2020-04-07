function settingsComponent(props) {
  return (
    <Page>

      <Section>
        The small dot circles the larger dot once every hour, thus allowing more precise
        reading of minutes.
        Touching the display will show month, date, hour and minute, as well as statistics values
      </Section>

      <Link source={"https://dev.fitbit.com/build/guides/user-interface/css/#web-color-names"}>
        Click this text for a list of understood color names
      (Also the "Hex" style name is understood)
      </Link>

      <Section title="Background colors" >
        <TextInput settingsKey="bgColor" label={<Text>Background color</Text>} />
        <Toggle settingsKey="ticks" label="Ticks instead of numbers"/>
        <TextInput settingsKey="tickColor" label={<Text>Hour ticks/numbers color</Text>} />
        <TextInput settingsKey="batColor" label={<Text>Center charge indicator color</Text>} />
        </Section>

      <Section title="Day and Night colors" >
        <TextInput settingsKey="dayColor" label={<Text>Day time color</Text>} />
        <TextInput settingsKey="nightColor" label={<Text>Night time color</Text>} />
        </Section>

      <Section title="Hour and Minute colors" >
        <TextInput settingsKey="hourColor" label={<Text>Hour color</Text>} />
        <TextInput settingsKey="minColor" label={<Text>Minute color</Text>} />
        <TextInput settingsKey="hourLColor" label={<Text>Hour Line color</Text>} />
        <TextInput settingsKey="minLColor" label={<Text>Minute Line color</Text>} />
        </Section>

      <Section title="Statistics colors" >
        <TextInput settingsKey="stepsColor" label={<Text>Steps color</Text>} />
        <TextInput settingsKey="caloriesColor" label={<Text>Calories color</Text>} />
        <TextInput settingsKey="floorsColor" label={<Text>
        {props.settings.isLite === 'true' ? `Distance color` : `Floors color` }</Text>} />
        <TextInput settingsKey="activityColor" label={<Text>Activity color</Text>} />
        </Section>

      <Text align="center" >
        <Button icon="button.png" label="Show all calendars" onClick={() => {props.settingsStorage.setItem("calall", "true")}} />
              <Text align="center">or</Text>
      <Button label="Hide all calendars" onClick={() => {props.settingsStorage.setItem("calall", "false")}} />
        {typeof(props.settings.calall) !== 'undefined' && <Text align="center">Updating...</Text> }
      </Text>

      {typeof(props.settings.calname0) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname0}`} >
                <TextInput settingsKey="calcolor0" label="Color for this calendar" />
                    <Toggle settingsKey="cal0" label="Display this calendar" />
              </Section>
      }
      {typeof(props.settings.calname1) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname1}`} >
                <TextInput settingsKey="calcolor1" label="Color for this calendar" />
                    <Toggle settingsKey="cal1" label="Display this calendar" />
              </Section>
      }
      {typeof(props.settings.calname2) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname2}`}>
                <TextInput settingsKey="calcolor2" label="Color for this calendar" />
                    <Toggle settingsKey="cal2" label="Display this calendar" />
              </Section>
      }
      {typeof(props.settings.calname3) !== 'undefined' &&
              <Section title={`Calendar: ${props.settings.calname3}`} >
                    <TextInput settingsKey="calcolor3" label="Color for this calendar" />
                        <Toggle settingsKey="cal3" label="Display this calendar" />
                  </Section>
      }
      {typeof(props.settings.calname4) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname4}`} >
                <TextInput settingsKey="calcolor4" label="Color for this calendar" />
                    <Toggle settingsKey="cal4" label="Display this calendar"/>
              </Section>
      }
      {typeof(props.settings.calname5) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname5}`} >
                <TextInput settingsKey="calcolor5" label="Color for this calendar" />
                    <Toggle settingsKey="cal5" label="Display this calendar"/>
              </Section>
      }
      {typeof(props.settings.calname6) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname6}`} >
                <TextInput settingsKey="calcolor6" label="Color for this calendar" />
                    <Toggle settingsKey="cal6" label="Display this calendar"/>
              </Section>
      }
      {typeof(props.settings.calname7) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname7}`} >
                <TextInput settingsKey="calcolor7" label="Color for this calendar" />
                    <Toggle settingsKey="cal7" label="Display this calendar"/>
              </Section>
      }
      {typeof(props.settings.calname8) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname8}`} >
                <TextInput settingsKey="calcolor8" label="Color for this calendar" />
                    <Toggle settingsKey="cal8" label="Display this calendar"/>
              </Section>
      }
      {typeof(props.settings.calname9) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname9}`} >
                <TextInput settingsKey="calcolor9" label="Color for this calendar" />
                    <Toggle settingsKey="cal9" label="Display this calendar"/>
              </Section>
      }
      {typeof(props.settings.calname10) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname10}`} >
                <TextInput settingsKey="calcolor10" label="Color for this calendar" />
                    <Toggle settingsKey="cal10" label="Display this calendar"/>
              </Section>
      }
      {typeof(props.settings.calname11) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname11}`} >
                <TextInput settingsKey="calcolor11" label="Color for this calendar" />
                    <Toggle settingsKey="cal11" label="Display this calendar"/>
              </Section>
      }
      {typeof(props.settings.calname12) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname12}`} >
                <TextInput settingsKey="calcolor12" label="Color for this calendar" />
                    <Toggle settingsKey="cal12" label="Display this calendar"/>
              </Section>
      }
      {typeof(props.settings.calname13) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname13}`} >
                <TextInput settingsKey="calcolor13" label="Color for this calendar" />
                    <Toggle settingsKey="cal13" label="Display this calendar"/>
              </Section>
      }
      {typeof(props.settings.calname14) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname14}`} >
                <TextInput settingsKey="calcolor14" label="Color for this calendar" />
                    <Toggle settingsKey="cal14" label="Display this calendar"/>
              </Section>
      }
      {typeof(props.settings.calname15) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname15}`} >
                <TextInput settingsKey="calcolor15" label="Color for this calendar" />
                    <Toggle settingsKey="cal15" label="Display this calendar"/>
              </Section>
      }
      {typeof(props.settings.calname16) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname16}`} >
                <TextInput settingsKey="calcolor16" label="Color for this calendar" />
                    <Toggle settingsKey="cal16" label="Display this calendar"/>
              </Section>
      }
      {typeof(props.settings.calname17) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname17}`} >
                <TextInput settingsKey="calcolor17" label="Color for this calendar" />
                    <Toggle settingsKey="cal17" label="Display this calendar" />
              </Section>
      }
      {typeof(props.settings.calname18) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname18}`} >
                <TextInput settingsKey="calcolor18" label="Color for this calendar" />
                    <Toggle settingsKey="cal18" label="Display this calendar" />
              </Section>
      }
      {typeof(props.settings.calname19) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname19}`} >
                <TextInput settingsKey="calcolor19" label="Color for this calendar" />
                    <Toggle settingsKey="cal19" label="Display this calendar" />
              </Section>
      }
      {typeof(props.settings.calname20) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname20}`} >
                <TextInput settingsKey="calcolor20" label="Color for this calendar" />
                    <Toggle settingsKey="cal20" label="Display this calendar" />
              </Section>
      }
      {typeof(props.settings.calname21) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname21}`} >
                <TextInput settingsKey="calcolor21" label="Color for this calendar" />
                    <Toggle settingsKey="cal21" label="Display this calendar" />
              </Section>
      }
      {typeof(props.settings.calname22) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname22}`} >
                <TextInput settingsKey="calcolor22" label="Color for this calendar" />
                    <Toggle settingsKey="cal22" label="Display this calendar" />
              </Section>
      }
      {typeof(props.settings.calname23) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname23}`} >
                <TextInput settingsKey="calcolor23" label="Color for this calendar" />
                    <Toggle settingsKey="cal23" label="Display this calendar" />
              </Section>
      }
      {typeof(props.settings.calname24) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname24}`} >
                <TextInput settingsKey="calcolor24" label="Color for this calendar" />
                    <Toggle settingsKey="cal24" label="Display this calendar" />
              </Section>
      }
      {typeof(props.settings.calname25) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname25}`} >
                <TextInput settingsKey="calcolor25" label="Color for this calendar" />
                    <Toggle settingsKey="cal25" label="Display this calendar" />
              </Section>
      }
      {typeof(props.settings.calname26) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname26}`} >
                <TextInput settingsKey="calcolor26" label="Color for this calendar" />
                    <Toggle settingsKey="cal26" label="Display this calendar" />
              </Section>
      }
      {typeof(props.settings.calname27) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname27}`} >
                <TextInput settingsKey="calcolor27" label="Color for this calendar" />
                    <Toggle settingsKey="cal27" label="Display this calendar" />
              </Section>
      }
      {typeof(props.settings.calname28) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname28}`} >
                <TextInput settingsKey="calcolor28" label="Color for this calendar" />
                    <Toggle settingsKey="cal28" label="Display this calendar" />
              </Section>
      }
      {typeof(props.settings.calname29) !== 'undefined' &&
          <Section title={`Calendar: ${props.settings.calname29}`} >
                <TextInput settingsKey="calcolor29" label="Color for this calendar" />
                    <Toggle settingsKey="cal29" label="Display this calendar" />
              </Section>
      }
      </Page>
  )
}

registerSettingsPage(settingsComponent);
