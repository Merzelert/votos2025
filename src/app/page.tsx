import VotingSystem from "@/components/voting-system"
import { Suspense } from "react"


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VotingSystem />
    </Suspense>
  )
}