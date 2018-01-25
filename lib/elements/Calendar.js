import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import styled from 'styled-components';
import moment from 'moment';
import Swipeable from 'react-swipeable';
import Color from 'color';
import MdChevronLeft from 'react-icons/lib/md/chevron-left';
import MdChevronRight from 'react-icons/lib/md/chevron-right';

const createDateObjects = (startOfMonth, weekOffset = 0) => {
  let diff = startOfMonth.weekday() - weekOffset;
  if (diff < 0) diff += 7;

  const prevMonthDays = [];
  for (let i = 0; i < diff; i++) {
    prevMonthDays.push({
      day: startOfMonth.clone().subtract(diff - i, 'days'),
      prevMonth: true,
    });
  }

  const currentMonthDays = [];
  for (let i = 1; i < startOfMonth.daysInMonth() + 1; i++) {
    currentMonthDays.push({
      day: moment([startOfMonth.year(), startOfMonth.month(), i]),
    });
  }

  const daysAdded = prevMonthDays.length + currentMonthDays.length - 1;

  const nextMonthDays = [];
  let i = 1;
  while (daysAdded + i < 42) {
    nextMonthDays.push({
      day: currentMonthDays[currentMonthDays.length - 1].day
        .clone()
        .add(i, 'days'),
      nextMonth: true,
    });

    i += 1;
  }

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
};

const Button = styled.button`
  background: transparent;
  border: 0;
  font-size: 1.2em;
  color: ${props => props.theme.color.secondary};
  cursor: pointer;
  &:focus {
    color: yellow;
    outline: none ;
  }
  margin-top: -5px;
`;

const Container = styled.div`
  width: 100%;
  background-color: ${props =>
    Color(props.theme.color.secondary)
      .alpha(0.9)
      .string()};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  height: 250px;
  min-width: 300px;
  max-width: 440px;
  background: ${props => props.theme.background.primary};
`;

const Header = styled.div`
  height: 34px;
  display: flex;
  justify-content: space-between;
  text-transform: capitalize;
  align-items: center;
  color: white;
  background: ${props => props.theme.color.primary};
`;

const MonthSwitch = styled.div`
  display: flex;
`;

const MonthLabel = styled.div`
  min-width: 83px;
  text-align: center;
`;

const YearSwitch = styled.div`
  display: flex;
`;

const YearLabel = styled.div`
  min-width: 40px;
  text-align: center;
`;

const Days = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  cursor: pointer;
  flex-grow: 1;
`;

const WeekDays = styled.div`
  display: flex;
  width: 100%;
  background: white;
`;

const StyledGridItem = styled.div`
  ${props =>
    props.active
      ? `
        font-weight: 700;
        color: white;
        background: ${props.theme.color.secondary};
        `
      : ``} ${props =>
      props.prevMonth || props.nextMonth
        ? `
        color: ${props.theme.color.light};
        `
        : ``} flex: 0 14.28571%;
  text-align: center;
  border-right: none;
  border-bottom: 1px solid #ddd;
  padding: 0.25rem;
  ${WeekDays} & {
    border: none;
    padding: 0.2em;
    font-size: 0.8em;
    :nth-child(-n + 7) {
      border-top: none;
    }
  }
  :nth-child(-n + 7) {
    border-top: '1px solid #ddd';
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-transform: capitalize;
`;

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: props.currentDate.clone().startOf('day'),
      calendarMonth: props.currentDate.clone().startOf('month'),
    };
    this.handleNextMonth = this.handleNextMonth.bind(this);
    this.handlePrevMonth = this.handlePrevMonth.bind(this);
    this.handleNextYear = this.handleNextYear.bind(this);
    this.handlePrevYear = this.handlePrevYear.bind(this);
    this.swipingLeft = this.swipingLeft.bind(this);
    this.swipingRight = this.swipingRight.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  handleClickOutside(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onChange(this.state.date);
  }

  swipingLeft() {
    console.log('swop');
    this.handlePrevMonth();
  }

  swipingRight() {
    console.log('swop');
    this.handleNextMonth();
  }

  handleNextMonth() {
    this.setState(oldState => ({
      calendarMonth: oldState.calendarMonth.add(1, 'months').startOf('month'),
    }));
  }

  handlePrevMonth() {
    this.setState(oldState => ({
      calendarMonth: oldState.calendarMonth
        .subtract(1, 'months')
        .startOf('month'),
    }));
  }

  handleNextYear() {
    this.setState(oldState => ({
      calendarMonth: oldState.calendarMonth.add(1, 'year'),
    }));
  }

  handlePrevYear() {
    this.setState(oldState => ({
      calendarMonth: oldState.calendarMonth.subtract(1, 'year'),
    }));
  }

  onChange(day) {
    let { confirm, dateFormat } = this.props;
    this.setState({ date: day }, () => {
      confirm(this.state.date.format(dateFormat));
    });
  }

  render() {
    let { locale, weekOffset } = this.props;
    let { date, calendarMonth } = this.state;

    return (
      <Swipeable
        onSwipedLeft={this.swipingLeft}
        onSwipedRight={this.swipingRight}
      >
        <Container>
          <Content>
            <Header>
              <MonthSwitch>
                <Button onClick={this.handlePrevMonth}>
                  <MdChevronLeft />
                </Button>
                <MonthLabel>
                  {calendarMonth.locale(locale).format('MMMM')}
                </MonthLabel>
                <Button onClick={this.handleNextMonth}>
                  <MdChevronRight />
                </Button>
              </MonthSwitch>
              <YearSwitch>
                <Button onClick={this.handlePrevYear}>
                  <MdChevronLeft />
                </Button>
                <YearLabel>
                  {calendarMonth.locale(locale).format('YYYY')}
                </YearLabel>
                <Button onClick={this.handleNextYear}>
                  <MdChevronRight />
                </Button>
              </YearSwitch>
            </Header>
            <WeekDays>
              {Array(7)
                .fill()
                .map((_, i) => i + 1 + weekOffset)
                .map(weekDay => (
                  <StyledGridItem key={`week-day-${weekDay}`} weekDays={true}>
                    {moment()
                      .isoWeekday(weekDay)
                      .locale(locale)
                      .format('dd')}
                  </StyledGridItem>
                ))}
            </WeekDays>

            <Days>
              {createDateObjects(calendarMonth, weekOffset).map((day, i) => (
                <GridItem
                  key={`day-${i}`}
                  day={day}
                  date={date}
                  onClick={this.onChange}
                >
                  {day.day.format('D')}
                </GridItem>
              ))}
            </Days>
          </Content>
        </Container>
      </Swipeable>
    );
  }
}

class GridItem extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onClick(this.props.day.day);
  }

  render() {
    let { day, date } = this.props;

    return (
      <StyledGridItem
        active={day.day.isSame(date)}
        onClick={this.onClick}
        nextMonth={day.nextMonth}
        prevMonth={day.prevMonth}
      >
        {this.props.children}
      </StyledGridItem>
    );
  }
}

Calendar.propTypes = {
  confirm: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  weekOffset: PropTypes.number.isRequired,
  currentDate: PropTypes.object.isRequired,
  dateFormat: PropTypes.string,
  locale: PropTypes.string,
};

Calendar.defaultProps = {
  weekOffset: 0,
  currentDate: moment(),
  dateFormat: 'DD.MM.YYYY',
  locale: 'en',
};

export default onClickOutside(Calendar);