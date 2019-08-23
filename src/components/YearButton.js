import React from 'react';
import { IoMdArrowDropleft,  IoMdArrowDropright} from "react-icons/io";

import Box from './Box'
import Flex from './Flex'
import Button from './Button'

const YearButton = ({ currentYear, years, handleLastYear, darkBg, handleNextYear, ...props}) => {
  return (
    <div>
    {darkBg ? (
      <Flex alignItems="center" {...props}>
        <Button.lightBg
          px="0.125em"
          py="0.125em"
          borderRadius="0.25em"
          disabled={currentYear === years.length - 1}
          onClick={handleLastYear}
        >
          <IoMdArrowDropleft size="1.5em" />
        </Button.lightBg>
        <Box px="1em" py="0.375em" border="1px solid" mx="0.25em">
          {years[currentYear].label}
        </Box>
        <Button.lightBg
          px="0.125em"
          py="0.125em"
          borderRadius="0.25em"
          disabled={!Boolean(currentYear)}
          onClick={handleNextYear}
        >
          <IoMdArrowDropright size="1.5em" />
        </Button.lightBg>
      </Flex>
    ) : (
      <Flex alignItems="center" {...props}>
        <Button
          px="0.125em"
          py="0.125em"
          borderRadius="0.25em"
          disabled={currentYear === years.length - 1}
          onClick={handleLastYear}
        >
          <IoMdArrowDropleft size="1.5em" />
        </Button>
        <Box px="1em" py="0.375em" border="1px solid" mx="0.25em">
          {years[currentYear].label}
        </Box>
        <Button
          px="0.125em"
          py="0.125em"
          borderRadius="0.25em"
          disabled={!Boolean(currentYear)}
          onClick={handleNextYear}
        >
          <IoMdArrowDropright size="1.5em" />
        </Button>
      </Flex>
    )}
    </div>
  );
};

export default YearButton;
