import { Button, Card, CardBody } from "@heroui/react";
import { MdOutlineErrorOutline } from "react-icons/md";

export default function Error({ message, description, reFetch }) {
  return (
    <div className="flex justify-center items-center py-10">
      <Card className="max-w-lg w-full  shadow-none  bg-danger-50">
        <CardBody className="flex flex-col items-center text-center gap-3 p-6">
          <MdOutlineErrorOutline className="text-4xl text-red-600 " />

          <h2 className="text-xl font-semibold text-danger">{message}</h2>
          <p className="text-default-600 text-sm">{description}</p>
          <Button
            onPress={reFetch}
            variant="solid"
            color="primary"
            className="mt-2 "
          >
            load pots
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
