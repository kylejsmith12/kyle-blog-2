const PeopleColumn = ({ people }) => (
  <div>
    {Array.isArray(people)
      ? people.map((person, personIndex) => (
          <React.Fragment key={personIndex}>
            {`${person.name} - ${person.description}`}
            {personIndex < people.length - 1 && <br />}
          </React.Fragment>
        ))
      : `${people.name} - ${people.description}`}
  </div>
);
